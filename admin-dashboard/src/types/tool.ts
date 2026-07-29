export interface ToolInfo {
  name: string
  description: string
}

export interface ToolsListResponse {
  success: boolean
  data: ToolInfo[]
}

export interface ToolExecuteRequest {
  input: Record<string, unknown>
}

export interface ToolExecuteResponse {
  success: boolean
  data: {
    result: unknown
    metadata?: Record<string, unknown>
  }
}