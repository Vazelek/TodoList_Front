export interface TaskItem {
  id: number,
  name: string,
  end_date: Date,
  position: number,
  completed_by: string | null,
}
