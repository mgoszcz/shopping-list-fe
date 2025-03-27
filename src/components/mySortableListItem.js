import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CategoryOrderListItem from "./categoryOrderListItem";

export function MySortableListItem({ item, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CategoryOrderListItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      item={item}
      {...props}
    />
  );
}

export default MySortableListItem;
