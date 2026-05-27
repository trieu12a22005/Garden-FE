export type UserRole = 'USER' | 'FARMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Garden {
  id: string;
  name: string;
  address?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectedReason?: string;
  farmerId: string;
  farmer?: Pick<User, 'id' | 'fullName' | 'email'>;
  createdAt: string;
  updatedAt: string;
  realPlants?: RealPlant[];
}

export type PlantStatus = 'SEED' | 'SPROUT' | 'GROWING' | 'BUDDING' | 'BLOOMING' | 'RESTING' | 'NEEDS_CARE' | 'COMPLETED';

export type ResourceType = 'WATER' | 'SUNLIGHT' | 'FERTILIZER' | 'AIR' | 'LOVE' | 'DEW';
export type VerifyType = 'SELF_CONFIRM' | 'TIMER' | 'OPTIONAL_PHOTO';
export type CareTaskType = 'WATER_PLANT' | 'BREATHING' | 'DRINK_WATER' | 'WRITE_JOURNAL' | 'LISTEN_SOUND' | 'SHORT_WALK';

export interface FlowerType {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  defaultDuration?: number;
  stageImages?: Partial<Record<PlantStatus, string>>;
  stageDurations?: Partial<Record<PlantStatus, number>>;
  availableCount?: number;
  gardens?: Array<{ id: string; name: string; address?: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface RealPlant {
  id: string;
  code: string;
  status: PlantStatus;
  isAssigned: boolean;
  plantedAt?: string;
  completedAt?: string;
  flowerTypeId: string;
  flowerType?: FlowerType;
  gardenId: string;
  garden?: Garden;
  createdAt: string;
  updatedAt: string;
}

export interface PlantUpdate {
  id: string;
  realPlantId: string;
  realPlant?: RealPlant;
  farmerId: string;
  farmer?: Pick<User, 'id' | 'fullName'>;
  imageUrl: string;
  status: PlantStatus;
  note?: string;
  healthNote?: string;
  createdAt: string;
}

export interface VirtualPlant {
  id: string;
  nickname?: string;
  status: PlantStatus;
  growthPoint: number;
  streakCount: number;
  waterAmount: number;
  sunlightAmount: number;
  fertilizerAmount: number;
  airAmount: number;
  loveAmount: number;
  dewAmount: number;
  lastCaredAt?: string;
  userId: string;
  user?: Pick<User, 'id' | 'fullName' | 'email'>;
  flowerTypeId: string;
  flowerType?: FlowerType;
  realPlantId: string;
  realPlant?: RealPlant;
  createdAt: string;
  updatedAt: string;
}

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  type: CareTaskType;
  isDefault: boolean;
  isActive: boolean;
  rewardResource: ResourceType;
  rewardAmount: number;
  growthReward: number;
  verifyType: VerifyType;
  durationSeconds?: number;
  characterImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodJournal {
  id: string;
  userId: string;
  mood: 'VERY_BAD' | 'BAD' | 'NORMAL' | 'GOOD' | 'VERY_GOOD';
  note?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemCount: number;
    currentPage: number;
  };
}
