import React, { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import MySortableListItem from "./mySortableListItem";
import CategoryOrderListItem from "./categoryOrderListItem";
import { List, Paper } from "@mui/material";

export default function CategoryOrderListDnd({ orderList }) {
  const [activeItem, setActiveItem] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsList = [...orderList];
    itemsList.sort((a, b) => a.category_order - b.category_order);
    setItems(
      itemsList.map((item) => {
        return { title: item.category.name, id: item.category.id };
      })
    );
  }, [orderList]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    const { active } = event;
    const activeItem = items.find((item) => item.id === active.id);
    if (activeItem) {
      setActiveItem(activeItem);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveItem(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Paper sx={{ m: 4 }}>
        <List>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <MySortableListItem key={item.id} item={item} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeItem ? <CategoryOrderListItem item={activeItem} /> : null}
          </DragOverlay>
        </List>
      </Paper>
    </DndContext>
  );
}
