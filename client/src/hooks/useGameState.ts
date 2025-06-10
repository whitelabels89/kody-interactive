import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GameState, Achievement } from "@shared/schema";

export function useGameState() {
  const queryClient = useQueryClient();

  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: ["/api/game-state"],
    initialData: {
      currentLevel: 1,
      completedLevels: [],
      totalStars: 0,
      badges: [],
      achievements: [],
      audioEnabled: true,
    }
  });

  const updateGameStateMutation = useMutation({
    mutationFn: async (updates: Partial<GameState>) => {
      const response = await apiRequest("POST", "/api/game-state", updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
    }
  });

  const completeLevelMutation = useMutation({
    mutationFn: async ({ level, stars, achievement }: { level: number; stars: number; achievement?: Achievement }) => {
      const response = await apiRequest("POST", "/api/complete-level", { level, stars, achievement });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
    }
  });

  const updateGameState = (updates: Partial<GameState>) => {
    updateGameStateMutation.mutate(updates);
  };

  const completeLevel = (level: number, stars: number, achievement?: Achievement) => {
    completeLevelMutation.mutate({ level, stars, achievement });
  };

  return {
    gameState: gameState!,
    isLoading,
    updateGameState,
    completeLevel,
    isUpdating: updateGameStateMutation.isPending || completeLevelMutation.isPending,
  };
}
