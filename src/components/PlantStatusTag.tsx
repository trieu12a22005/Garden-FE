import type { PlantStatus } from '../types';
import { Tag } from 'antd';

const statusConfig: Record<PlantStatus, { label: string; className: string }> = {
  SEED:       { label: 'Hạt giống',   className: 'garden-tag-seed' },
  SPROUT:     { label: 'Nảy mầm',    className: 'garden-tag-sprout' },
  GROWING:    { label: 'Sinh trưởng', className: 'garden-tag-growing' },
  BUDDING:    { label: 'Có nụ',       className: 'garden-tag-budding' },
  BLOOMING:   { label: 'Nở hoa',     className: 'garden-tag-blooming' },
  RESTING:    { label: 'Nghỉ ngơi',  className: 'garden-tag-resting' },
  NEEDS_CARE: { label: 'Cần chăm sóc', className: 'garden-tag-needs_care' },
  COMPLETED:  { label: 'Hoàn thành', className: 'garden-tag-completed' },
};

export const PlantStatusTag = ({ status }: { status: PlantStatus }) => {
  const config = statusConfig[status] ?? { label: status, className: '' };
  return <Tag className={config.className}>{config.label}</Tag>;
};

export const getStatusLabel = (status: PlantStatus) =>
  statusConfig[status]?.label ?? status;

export const PLANT_STATUS_OPTIONS = Object.entries(statusConfig).map(([value, { label }]) => ({
  value,
  label,
}));
