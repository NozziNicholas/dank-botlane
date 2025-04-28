"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useChampionAbilities } from "@/hooks/useChampionAbilities";

// Sortable item component
function SortableSkill({ id, skill, index, abilities, patch }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative w-10 h-10 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${abilities[skill].image.full}`}
        alt={abilities[skill].name}
        fill
        className="object-cover rounded"
      />
      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {skill}
      </div>
      <div className="absolute -bottom-1 -left-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
}

// Draggable overlay component
function SkillOverlay({ skill, abilities, patch }) {
  return (
    <div className="relative w-10 h-10">
      <Image
        src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/${abilities[skill].image.full}`}
        alt={abilities[skill].name}
        fill
        className="object-cover rounded"
      />
      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {skill}
      </div>
    </div>
  );
}

export default function SkillOrderSelector({
  champion,
  patch,
  onSkillOrderChange,
}) {
  const { abilities, loading } = useChampionAbilities(champion, patch);
  const [skillOrder, setSkillOrder] = useState(["Q", "W", "E"]);
  const [activeId, setActiveId] = useState(null);
  const isInitialMount = useRef(true);

  // Set up sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Memoize the callback to prevent infinite loops
  const handleSkillOrderChange = useCallback(
    (newOrder) => {
      if (onSkillOrderChange) {
        // Ensure we're passing a string
        const orderString = Array.isArray(newOrder)
          ? newOrder.join(",")
          : newOrder;
        onSkillOrderChange(orderString);
      }
    },
    [onSkillOrderChange]
  );

  // Update parent component when skill order changes
  useEffect(() => {
    // Only call handleSkillOrderChange when skillOrder actually changes
    // and not on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    handleSkillOrderChange(skillOrder);
  }, [skillOrder, handleSkillOrderChange]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // If dropping in the same position
    if (active.id === over.id) return;

    const oldIndex = parseInt(active.id.split("-")[1]);
    const newIndex = parseInt(over.id.split("-")[1]);

    setSkillOrder(arrayMove(skillOrder, oldIndex, newIndex));
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (loading || !champion) {
    return <div className="text-gray-500">Loading abilities...</div>;
  }

  return (
    <div className="w-full">
      <h4 className="text-sm font-medium mb-2">Skill Order</h4>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex flex-col gap-4">
          {/* Skill Order */}
          <div>
            <h5 className="text-xs text-gray-500 mb-2">
              Drag to reorder skills
            </h5>
            <div className="flex gap-2 min-h-[40px] p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <SortableContext
                items={skillOrder.map((skill, index) => `${skill}-${index}`)}
                strategy={horizontalListSortingStrategy}
              >
                {skillOrder.map((skill, index) => (
                  <SortableSkill
                    key={`${skill}-${index}`}
                    id={`${skill}-${index}`}
                    skill={skill}
                    index={index}
                    abilities={abilities}
                    patch={patch}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          {/* Text display of skill order */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h5 className="text-xs text-gray-500 mb-1">
              Selected Skill Order:
            </h5>
            <p className="text-sm font-medium">
              {skillOrder.map((skill, index) => (
                <span key={index}>
                  {skill}
                  {index < skillOrder.length - 1 ? " → " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <SkillOverlay
              skill={activeId.toString().split("-")[0]}
              abilities={abilities}
              patch={patch}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
