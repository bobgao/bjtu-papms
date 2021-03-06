import { Spin } from 'antd';
import { connect } from 'dva';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { TimeConfig } from '@/api/admin';
import commonStyles from '../common.less';
import PageHeader from '@/layouts/PageHeader';
import { ConnectProps, ConnectState } from '@/models/connect';
import SimpleForm, { SimpleFormItemProps, SimpleFormItemType } from '@/components/SimpleForm';

export interface TimeProps extends ConnectProps {
  loading?: {
    editTime?: boolean;
    fetchTime?: boolean;
  };
  timeConfig?: TimeConfig;
}

const formItemProps = {
  labelCol: {
    sm: 24,
    md: 7,
  },
  wrapperCol: {
    sm: 24,
    md: 17,
  },
};

const formItems: SimpleFormItemProps[] = [
  {
    id: 'used',
    title: '是否启用',
    type: SimpleFormItemType.Switch,
    decoratorOptions: { rules: [{ required: true, message: '必填项' }] },
    itemProps: { checkedChildren: '启用', unCheckedChildren: '停用' },
  },
  ...[
    ['position_start', '岗位维护开始时间'],
    ['position_end', '岗位维护结束时间'],
    ['apply_start', '学生申请开始时间'],
    ['apply_end', '学生申请结束时间'],
  ].map(([id, title]) => ({
    id,
    title,
    type: SimpleFormItemType.DatePicker,
    decoratorOptions: { rules: [{ required: true, message: '必填项' }] },
    itemProps: { showTime: true, style: { maxWidth: 320, width: '100%' } },
  })),
];

const format = (timeConfig: TimeConfig): { [K in keyof TimeConfig]: any } => ({
  used: timeConfig.used ? true : false,
  position_start: moment.unix(timeConfig.position_start),
  position_end: moment.unix(timeConfig.position_end),
  apply_start: moment.unix(timeConfig.apply_start),
  apply_end: moment.unix(timeConfig.apply_end),
});

const formatBack = (fieldsValue: { [K in keyof TimeConfig]: Moment }): TimeConfig => ({
  used: fieldsValue.used ? 1 : 0,
  position_start: fieldsValue.position_start.unix(),
  position_end: fieldsValue.position_end.unix(),
  apply_start: fieldsValue.apply_start.unix(),
  apply_end: fieldsValue.apply_end.unix(),
});

const Time: React.SFC<TimeProps> = ({ timeConfig, dispatch, loading }) => {
  useState(() => dispatch({ type: 'admin/fetchTime' }));
  const onSubmit = (v: { [K in keyof TimeConfig]: Moment }) =>
    dispatch({ type: 'admin/editTime', payload: { id: timeConfig.id, ...formatBack(v) } });
  return (
    <PageHeader>
      <div className={commonStyles.contentBody}>
        {loading.fetchTime || !timeConfig ? (
          <div style={{ width: '100%', padding: 64, textAlign: 'center' }}>
            <Spin spinning />
          </div>
        ) : (
          <SimpleForm
            formItems={formItems}
            formItemProps={formItemProps}
            initialFieldsValue={format(timeConfig)}
            onSubmit={onSubmit}
            resetText="重置"
            submitLoading={loading.editTime}
            submitText="提交"
          />
        )}
      </div>
    </PageHeader>
  );
};

export default connect(
  ({ loading, admin }: ConnectState): TimeProps => ({
    loading: {
      editTime: loading.effects['admin/editTime'],
      fetchTime: loading.effects['admin/fetchTime'],
    },
    timeConfig: admin.timeConfig,
  }),
)(Time);
