export interface TaskItem {
  id: number,
  name: string,
  end_date: Date,
  index: number,
  completed_by: string | null,
}