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
  farmerId: string;
  createdAt: string;
  updatedAt: string;
  realPlants?: RealPlant[];
}

export type PlantStatus = 'SEED' | 'SPROUT' | 'GROWING' | 'BUDDING' | 'BLOOMING' | 'RESTING' | 'NEEDS_CARE' | 'COMPLETED';

export interface FlowerType {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  defaultDuration?: number;
  createdAt: string;
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
  userId: string;
  flowerTypeId: string;
  flowerType?: FlowerType;
  realPlantId: string;
  realPlant?: RealPlant;
  createdAt: string;
}

export interface MoodJournal {
  id: string;
  userId: string;
  mood: 'VERY_BAD' | 'BAD' | 'NORMAL' | 'GOOD' | 'VERY_GOOD';
  note?: string;
  createdAt: string;
}

export type CareTaskType = 'WATER_PLANT' | 'BREATHING' | 'DRINK_WATER' | 'WRITE_JOURNAL' | 'LISTEN_SOUND' | 'SHORT_WALK';

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  type: CareTaskType;
  isDefault: boolean;
  isActive: boolean;
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
