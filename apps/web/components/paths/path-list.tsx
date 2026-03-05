import React from "react";
import { cn } from "@/lib/utils";

import { FilterTab, LearningPath, PathStatus, Difficulty } from "@/app/(main)/paths/types";

import { Button } from "@/components/ui/button";
import { X, Search, GridIcon } from "lucide-react";
import { Plus } from "@/components/ui/icons/plus";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Toggle } from "@/components/ui/toggle";
import PathCard from "./path-card";
import { usePathStore } from "@/app/(main)/paths/store";
import StatusTabs from "@/components/widgets/status-tabs";
import { EnumPathStatus, pathStatusNamed } from "@/app/(main)/paths/enum";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { gooey } from "@/components/ui/custom/gooey-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { updatePathItem } from "@/lib/api/paths";
import { resetLab } from "@/lib/api/labs";
import { fetchPaths } from "@/lib/api/paths";
import { SlidersHorizontal } from "@/components/ui/icons/sliders-horizontal";
import { ListIcon } from "@/components/ui/icons/list";

interface PathListProps {
  activeTab: FilterTab;
  onSelectPath: (id: string) => void;
  onAddPathClick: () => void;
}

export default function PathList({ activeTab, onSelectPath, onAddPathClick }: PathListProps) {
  const [isFiltersIconHovered, setIsFiltersIconHovered] = React.useState(false);
  const [isListIconHovered, setIsListIconHovered] = React.useState(false);
  const [isAddPathIconHovered, setIsAddPathIconHovered] = React.useState(false);
  const {
    paths,
    setPaths,
    updatePath,
    deletePath,
    viewMode,
    setViewMode,
    filterDifficulty,
    setFilterDifficulty,
    filterEstimatedDuration,
    setFilterEstimatedDuration,
    searchQuery,
    setSearchQuery,
    toggleStarred,
    showCorePathsOnly,
    toggleShowCorePathsOnly,
    setActiveTab
  } = usePathStore();

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
  };

  const safePaths = Array.isArray(paths) ? paths : [];
  const durationOptions = [
    { label: "< 1 hour", value: "under-1h", min: 0, max: 60 },
    { label: "1-3 hours", value: "1-3h", min: 60, max: 180 },
    { label: "3-6 hours", value: "3-6h", min: 180, max: 360 },
    { label: "6+ hours", value: "6h-plus", min: 360, max: Number.POSITIVE_INFINITY },
  ];

  const parseDurationToMinutes = (raw?: string) => {
    if (!raw) return null;
    const value = raw.toLowerCase();
    const rangeMatch = value.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    const singleMatch = value.match(/(\d+(?:\.\d+)?)/);
    const unitMultiplier = value.includes("week")
      ? 7 * 24 * 60
      : value.includes("day")
        ? 24 * 60
        : value.includes("hour") || value.includes("hr")
          ? 60
          : value.includes("min")
            ? 1
            : 60;

    if (rangeMatch) {
      const minVal = Number(rangeMatch[1]);
      const maxVal = Number(rangeMatch[2]);
      if (Number.isNaN(minVal) || Number.isNaN(maxVal)) return null;
      return ((minVal + maxVal) / 2) * unitMultiplier;
    }

    if (singleMatch) {
      const val = Number(singleMatch[1]);
      return Number.isNaN(val) ? null : val * unitMultiplier;
    }

    return null;
  };

  const getPathDurationMinutes = (path: LearningPath) => {
    if (typeof path.estimated_duration === "number" && path.estimated_duration > 0) {
      return path.estimated_duration;
    }
    return parseDurationToMinutes(path.estimatedDuration);
  };

  // Apply all filters
  const filteredPaths = safePaths.filter((path) => {
    // Tab filter
    if (activeTab !== "all" && path.status !== activeTab) return false;

    // Difficulty filter
    if (filterDifficulty && path.difficulty !== filterDifficulty) return false;

    // Estimated duration filter
    if (filterEstimatedDuration) {
      const selected = durationOptions.find((option) => option.value === filterEstimatedDuration);
      const minutes = getPathDurationMinutes(path);
      if (!selected || minutes === null) return false;
      if (!(minutes >= selected.min && minutes < selected.max)) return false;
    }

    // Core paths filter
    if (showCorePathsOnly && !path.starred) return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        path.title.toLowerCase().includes(query) ||
        path.description?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleStatusChange = async (id: string, status: PathStatus) => {
    try {
      await updatePath(id, { status });
      gooey.success({ 
        title: "Progress updated",
        description: "Your path progress has been saved." 
      });
    } catch (error) {
      console.error("Error updating status:", error);
      gooey.error({ 
        title: "Update failed",
        description: "Unable to update path status. Please try again." 
      });
    }
  };

  const clearFilters = () => {
    setFilterDifficulty(null);
    setFilterEstimatedDuration(null);
    setSearchQuery("");
    if (showCorePathsOnly) {
      toggleShowCorePathsOnly();
    }
  };

  const handleCoreToggle = async (id: string) => {
    try {
      await toggleStarred(id);
    } catch (error) {
      console.error("Error toggling starred:", error);
      gooey.error({ 
        title: "Failed to update path",
        description: "Unable to update starred status. Please try again." 
      });
    }
  };

  const handleRestartPath = async (id: string) => {
    try {
      // Find the path to get its learning path items
      const path = safePaths.find(p => p.id === id);
      if (!path) {
        gooey.error({ 
          title: "Path not found",
          description: "This learning path couldn't be located. It may have been deleted." 
        });
        return;
      }

      // Reset the main path status
      await updatePath(id, { status: "not-started" as PathStatus });
      
      // Reset all learning path items to not-started
      if (path.learning_path_items && path.learning_path_items.length > 0) {
        const resetPromises = path.learning_path_items.map(async (item) => {
          // Reset the path item status and clear progress
          const itemUpdatePromise = updatePathItem(id, item.id, {
            status: "not-started",
            progress_data: null  // Clear any progress data
          });

          // If the item has an associated lab, reset that too
          const labResetPromise = item.lab_id 
            ? resetLab(item.lab_id).catch(error => {
                console.warn(`Failed to reset lab ${item.lab_id}:`, error);
              })
            : Promise.resolve();

          return Promise.all([itemUpdatePromise, labResetPromise]);
        });
        
        await Promise.all(resetPromises);
      }
      
      // Refresh paths data from server to show updated state
      try {
        const freshPaths = await fetchPaths();
        setPaths(freshPaths);
      } catch (refreshError) {
        console.warn("Failed to refresh paths after restart:", refreshError);
      }
      
      gooey.success({ 
        title: "Path restarted",
        description: "You can now start this learning path from the beginning." 
      });
    } catch (error) {
      console.error("Error restarting path:", error);
      gooey.error({ 
        title: "Restart failed",
        description: "Unable to restart the path. Please try again." 
      });
    }
  };

  const handleDeletePath = async (id: string) => {
    try {
      await deletePath(id);
      gooey.success({ 
        title: "Path deleted",
        description: "The learning path has been removed from your library." 
      });
    } catch (error) {
      console.error("Error deleting path:", error);
      gooey.error({ 
        title: "Delete failed",
        description: "Unable to delete the path. Please try again." 
      });
    }
  };

  const renderFilterContent = () => (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Checkbox id="core-paths" checked={showCorePathsOnly} onCheckedChange={toggleShowCorePathsOnly} />
        <Label htmlFor="core-paths">Core paths only</Label>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Difficulty</h4>
        <div className="flex gap-2 *:grow">
          {(["intro", "intermediate", "advanced"] as Difficulty[]).map((difficulty) => (
            <Toggle
              key={difficulty}
              variant="outline"
              size="sm"
              pressed={filterDifficulty === difficulty}
              onPressedChange={() => setFilterDifficulty(filterDifficulty === difficulty ? null : difficulty)}
              className="px-3 text-xs capitalize">
              {difficulty}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Duration</h4>
        <div className="flex flex-col gap-2">
          {durationOptions.map((duration) => (
            <Toggle
              key={duration.value}
              variant="outline"
              size="sm"
              pressed={filterEstimatedDuration === duration.value}
              onPressedChange={() =>
                setFilterEstimatedDuration(filterEstimatedDuration === duration.value ? null : duration.value)
              }
              className="px-3 text-xs justify-start">
              {duration.label}
            </Toggle>
          ))}
        </div>
      </div>

      {(filterDifficulty || filterEstimatedDuration || showCorePathsOnly) && (
        <div className="text-end">
          <Button variant="link" size="sm" className="px-0!" onClick={clearFilters}>
            Clear Filters
            <X />
          </Button>
        </div>
      )}
    </div>
  );

  const renderPathItems = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPaths.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              onView={onSelectPath}
              onStatusChange={handleStatusChange}
              viewMode="grid"
              onCoreToggle={handleCoreToggle}
              onRestart={handleRestartPath}
              onDelete={handleDeletePath}
            />
          ))}
        </div>
      );
    }

    // List view
    return (
      <div className="grid grid-cols-1 space-y-4">
        {filteredPaths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            onView={onSelectPath}
            onStatusChange={handleStatusChange}
            viewMode="list"
            onCoreToggle={handleCoreToggle}
            onRestart={handleRestartPath}
            onDelete={handleDeletePath}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <StatusTabs 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          statusEnum={EnumPathStatus}
          statusNamed={pathStatusNamed}
          allLabel="All Paths"
        />

        <div className="flex w-full items-center gap-2 lg:w-auto">
          {/* Search input */}
          <div className="relative w-auto">
            <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 opacity-50" />
            <Input
              placeholder="Search learning paths..."
              className="ps-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="relative"
                onMouseEnter={() => setIsFiltersIconHovered(true)}
                onMouseLeave={() => setIsFiltersIconHovered(false)}
              >
                <SlidersHorizontal animate={isFiltersIconHovered ? true : undefined} />
                {(filterDifficulty || filterEstimatedDuration || showCorePathsOnly) && (
                  <Badge
                    variant="secondary"
                    className="absolute -end-1.5 -top-1.5 size-4 rounded-full p-0">
                    {(filterDifficulty ? 1 : 0) + (filterEstimatedDuration ? 1 : 0) + (showCorePathsOnly ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              {renderFilterContent()}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View mode toggle */}
          <ToggleGroup
            type="single"
            variant="outline"
            value={viewMode}
            onValueChange={(value) => value && setViewMode(value as "list" | "grid")}>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              onMouseEnter={() => setIsListIconHovered(true)}
              onMouseLeave={() => setIsListIconHovered(false)}
            >
              <ListIcon animate={isListIconHovered ? true : undefined} />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <GridIcon />
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Add button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={onAddPathClick}
                  className="fixed end-6 bottom-6 z-10 rounded-full! md:size-14"
                  onMouseEnter={() => setIsAddPathIconHovered(true)}
                  onMouseLeave={() => setIsAddPathIconHovered(false)}
                >
                  <Plus className="md:size-6" animate={isAddPathIconHovered ? true : undefined} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Create Learning Path</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {filteredPaths.length === 0 ? (
        <div className="flex h-[calc(100vh-12rem)] flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-medium">No learning paths found</h3>
          <p className="text-muted-foreground mt-2">Explore your first learning path to begin your curriculum</p>
        </div>
      ) : (
        renderPathItems()
      )}
    </>
  );
}
