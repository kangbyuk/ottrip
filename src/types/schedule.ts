export interface ScheduleData {
    id: number;
    title: string;
    start_time: string;
    end_time: string;
    description?: string;
    start?: Date;
    end?: Date;
    user_id?: string;
  }