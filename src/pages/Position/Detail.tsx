import React from 'react';
import styles from './Detail.less';
import QueueAnim from 'rc-queue-anim';
import { Button, Modal, Skeleton } from 'antd';
import { FormattedMessage } from 'umi-plugin-locale';
import { PositionDetailProps } from './models/position';
import { StandardTableAction } from '@/components/StandardTable';
import DescriptionList, { DescriptionProps } from '@/components/DescriptionList';

export interface DetailProps extends PositionDetailProps {
  currentRow?: object;
  currentRowKey?: string;
  loading?: boolean;
  onClickAction?: (rowKey: string, actionType: string, event: React.MouseEvent) => void;
  onClose?: () => void;
  visible?: boolean;
}

const renderFooter = (props: DetailProps): React.ReactNode => {
  const actionKey = Array.isArray(props.actionKey) ? props.actionKey : [props.actionKey];
  const actionArr: StandardTableAction[] = [];
  if (props.currentRow) {
    actionKey.forEach(key => {
      if (props.currentRow[key]) {
        if (Array.isArray(props.currentRow[key])) {
          actionArr.push(...props.currentRow[key]);
        } else {
          actionArr.push(props.currentRow[key]);
        }
      }
    });
  }
  return (
    <QueueAnim delay={[0, 500]} type="right">
      {actionArr
        .map(action => (
          <div className={styles.footerButton} key={action.type}>
            <Button
              icon={action.icon}
              loading={props.loading}
              onClick={(event: React.MouseEvent) =>
                props.onClickAction(props.currentRowKey, action.type, event)
              }
            >
              {action.text || action.type}
            </Button>
          </div>
        ))
        .concat(
          <div className={styles.footerButton} key="Close">
            <Button onClick={props.onClose} type="primary">
              <FormattedMessage id="words.close" />
            </Button>
          </div>,
        )}
    </QueueAnim>
  );
};

const Detail: React.SFC<DetailProps> = props => (
  <Modal
    className={styles.modal}
    footer={renderFooter(props)}
    onCancel={props.onClose}
    title={<FormattedMessage id="position.detail" />}
    visible={props.visible}
  >
    <Skeleton active paragraph={{ rows: 5 }} loading={props.loading}>
      <DescriptionList
        description={props.columns.map(
          (col): DescriptionProps => ({
            children: props.dataSource[col.dataIndex],
            key: col.dataIndex,
            term: col.title,
          }),
        )}
      />
    </Skeleton>
  </Modal>
);

Detail.defaultProps = {
  actionKey: 'action',
  columns: [],
  dataSource: {},
  currentRow: null,
  currentRowKey: null,
  loading: false,
  onClickAction: () => {},
  onClose: () => {},
  visible: false,
};

export default Detail;