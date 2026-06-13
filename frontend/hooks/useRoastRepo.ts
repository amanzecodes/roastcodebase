'use client'

import api from "@/lib/api"
import { ApiError, ERROR_MESSAGES } from "@/lib/errors"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import axios from "axios"

export interface RoastStartPayload {
  repoOwner: string
  repoName: string
  defaultBranch: string
}

export interface RoastStartResponse {
  roastId: string
}

async function startRoast(payload: RoastStartPayload): Promise<RoastStartResponse> {
  try {
    const res = await api.post('/roast/start', payload)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data
      const code = data?.code ?? 'INTERNAL_ERROR'
      const status = err.response?.status ?? 500
      const message = ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ?? data?.error ?? 'Something went wrong.'
      throw new ApiError(status, code, message)
    }
    throw err
  }
}

type Options = Omit<UseMutationOptions<RoastStartResponse, ApiError, RoastStartPayload>, 'mutationFn'>

export function useRoastRepo(options?: Options) {
  return useMutation({
    mutationFn: startRoast,
    ...options,
  })
}