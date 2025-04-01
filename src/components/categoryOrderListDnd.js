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

class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown",
      handler: ({ nativeEvent: event }) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          event.target.closest(".MuiIconButton-root")
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}

export default function CategoryOrderListDnd({
  orderList,
  setOrderList,
  setApplyDisabled,
}) {
  const [activeItem, setActiveItem] = useState({});

  const sensors = useSensors(
    useSensor(MyPointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event) {
    const { active } = event;
    const activeItem = orderList.find((item) => item.id === active.id);
    if (activeItem) {
      setActiveItem(activeItem);
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOrderList((orderList) => {
        const oldIndex = orderList.findIndex((item) => item.id === active.id);
        const newIndex = orderList.findIndex((item) => item.id === over.id);

        return arrayMove(orderList, oldIndex, newIndex);
      });
      setApplyDisabled(false);
    }

    setActiveItem(null);
  }

  function handleDelete(event) {
    const categoryId = parseInt(
      event.target.closest(".delete-category").getAttribute("category-id")
    );
    setOrderList(orderList.filter((item) => item.id !== categoryId));
    setApplyDisabled(false);
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
          <SortableContext
            items={orderList}
            strategy={verticalListSortingStrategy}
          >
            {orderList.map((item) => (
              <MySortableListItem
                key={item.id}
                item={item}
                handleDelete={handleDelete}
              />
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
