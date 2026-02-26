"use client"

import { Plus } from "lucide-react"
import { GamingButton } from "@/components/shared"

interface CreatePollButtonProps {
  matchId: string
}

export function CreatePollButton({ matchId }: CreatePollButtonProps) {
  return (
    <GamingButton
      variant="gold"
      size="md"
      fullWidth
      className="sm:w-auto"
      onClick={() => {
        // TODO: Open CreatePollModal with match pre-selected
        alert("Create Poll feature coming soon!")
      }}
    >
      <Plus className="mr-2 h-4 w-4" />
      Create a Prediction
    </GamingButton>
  )
}
