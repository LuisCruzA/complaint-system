export type Complaint = {
    id: string
    email: string
    description: string
    status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    dueDate: string | null
    createdAt: string
  }
  
  export type ListRes = { total: number; page: number; pageSize: number; items: Complaint[] }
  
  export const STATUS: Complaint['status'][] = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
  