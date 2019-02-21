import { Application } from 'egg';
import { intEnumValid } from '../../errcode';
import { setModelInstanceMethods } from '../../utils';
import {
  DefineModelAttributes,
  DATEONLY,
  INTEGER,
  JSON as JSONTYPE,
  STRING,
  TEXT,
} from 'sequelize';

export enum PositionType {
  '助管' = 'manage',
  '助教' = 'teach',
}

/**
 * @Ref https://www.yuque.com/hele/doc/qzuay6#StepsProps
 * Map `PostionStatus` to `StepStatus`
 */
export const PositionStatus = {
  待审核: 'process',
  审核通过: 'finish',
  审核不通过: 'error',
  草稿: 'process',
  已发布: 'finish',
};

export const PositionAuditStatus = {
  [PositionType.助管]: ['单位申报', '人事处审核', '研工部审核', '发布岗位'],
  [PositionType.助教]: [
    '教师申报',
    '用人单位审核',
    '教务处审核',
    '研究生院审核',
    '研工部审核',
    '发布岗位',
  ],
};

export interface Position {
  id?: number;
  semester: string;
  name: string;
  types: number;
  need: string;
  need_num: number;
  content: string;
  address: string;
  work_time_d: string;
  work_time_l: number;
  campus: number;
  way: number;
  start_t: string;
  end_t: string;
  class_type: number;
  class_num: number;
  class_time: number;
  status: number;
  audit: number;
  audit_log: string[] | string[][];
  department_code?: string;
  staff_jobnum?: string;
}

export const attr: DefineModelAttributes<Position> = {
  semester: {
    allowNull: false,
    comment: '学年学期',
    type: STRING(20),
    validate: { len: [0, 20], notEmpty: true },
  },
  name: {
    allowNull: false,
    comment: '岗位名称',
    type: STRING(255),
    validate: { len: [0, 255], notEmpty: true },
  },
  need: {
    allowNull: false,
    comment: '基本要求',
    type: TEXT,
    defaultValue: '',
  },
  types: {
    allowNull: false,
    comment: '三助类型',
    type: INTEGER,
    values: Object.keys(PositionType),
    validate: { notEmpty: true, ...intEnumValid(PositionType) },
  },
  need_num: {
    allowNull: false,
    comment: '岗位人数',
    type: INTEGER,
    validate: { isInt: true, notEmpty: true },
  },
  content: {
    allowNull: false,
    comment: '工作内容',
    defaultValue: '',
    type: TEXT,
  },
  address: {
    allowNull: false,
    comment: '工作地点',
    type: TEXT,
    validate: { notEmpty: true },
  },
  work_time_d: {
    allowNull: true,
    comment: '工作时间',
    type: TEXT,
    validate: { notEmpty: true },
  },
  work_time_l: {
    allowNull: true,
    comment: '周工作量',
    type: INTEGER,
    validate: { len: [0, 12], notEmpty: true },
  },
  campus: {
    allowNull: false,
    comment: '校区',
    type: INTEGER,
    defaultValue: 0,
    values: ['校本部', '东校区'],
    validate: { notEmpty: true, ...intEnumValid(2) },
  },
  way: {
    allowNull: false,
    comment: '聘用方式',
    type: INTEGER,
    defaultValue: 0,
    values: ['固定', '临时'],
    validate: { notEmpty: true, ...intEnumValid(2) },
  },
  start_t: {
    allowNull: false,
    comment: '聘用开始时间',
    type: DATEONLY,
    validate: { isDate: true, notEmpty: true },
  },
  end_t: {
    allowNull: false,
    comment: '聘用结束时间',
    type: DATEONLY,
    validate: { isDate: true, notEmpty: true },
  },
  class_type: {
    allowNull: true,
    comment: '课程类型',
    type: INTEGER,
    defaultValue: 0,
    values: ['本科生', '研究生'],
    validate: { notEmpty: true, ...intEnumValid(2) },
  },
  class_num: {
    allowNull: true,
    comment: '课程人数',
    type: INTEGER,
    validate: { notEmpty: true },
  },
  class_time: {
    allowNull: true,
    comment: '学时数',
    type: INTEGER,
    validate: { notEmpty: true },
  },
  status: {
    allowNull: false,
    comment: '状态',
    type: INTEGER,
    defaultValue: 0,
    values: Object.keys(PositionStatus),
    validate: { notEmpty: true, ...intEnumValid(PositionStatus) },
  },
  audit: {
    allowNull: false,
    comment: '审核进度',
    type: INTEGER,
    defaultValue: 0,
    values: ([] as any).concat(...Object.values(PositionAuditStatus)),
    validate: {
      notEmpty: true,
      ...intEnumValid(([] as any).concat(...Object.values(PositionAuditStatus))),
    },
  },
  audit_log: {
    allowNull: true,
    comment: '审核日志',
    type: JSONTYPE,
    defaultValue: JSON.stringify(['暂无记录']),
  },
};

export default (app: Application) => {
  const PositionModel = app.model.define('IntershipsPosition', attr, {
    tableName: 'interships_position',
  });
  PositionModel.associate = () => {
    app.model.Interships.Position.belongsTo(app.model.Dicts.Department, {
      foreignKey: 'department_code',
    });
    app.model.Interships.Position.belongsTo(app.model.People.Staff, {
      foreignKey: 'staff_jobnum',
    });
  };
  return setModelInstanceMethods(PositionModel, attr);
};
