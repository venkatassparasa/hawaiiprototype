import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X, Edit2, Check, ChevronRight } from 'lucide-react';

// Sortable field item component
const SortableFieldItem = ({ field, onRemove, onEditLabel, isEditing, editingLabel, onSetEditing, onSaveLabel, onCancelEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingLabel}
                onChange={(e) => onSetEditing(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-hawaii-ocean"
                placeholder="Enter label..."
                autoFocus
              />
              <button
                onClick={() => onSaveLabel(field.id)}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="font-medium text-slate-800">{field.label || field.name}</div>
              <div className="text-xs text-slate-500">{field.name} • {field.type}</div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {!isEditing && (
            <button
              onClick={() => onEditLabel(field.id, field.label || field.name)}
              className="p-1 text-slate-400 hover:text-slate-600"
              title="Edit label"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onRemove(field.id)}
            className="p-1 text-red-400 hover:text-red-600"
            title="Remove field"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FieldSelector = ({ availableFields, selectedFields, onFieldsChange }) => {
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = selectedFields.findIndex(field => field.id === active.id);
      const newIndex = selectedFields.findIndex(field => field.id === over.id);
      
      const reorderedFields = arrayMove(selectedFields, oldIndex, newIndex);
      onFieldsChange(reorderedFields);
    }
  };

  const addField = (field) => {
    const fieldExists = selectedFields.some(selected => selected.id === field.id);
    if (!fieldExists) {
      const newField = {
        ...field,
        label: field.name, // Default label is the field name
        selected: true
      };
      onFieldsChange([...selectedFields, newField]);
    }
  };

  const removeField = (fieldId) => {
    onFieldsChange(selectedFields.filter(field => field.id !== fieldId));
  };

  const editLabel = (fieldId, currentLabel) => {
    setEditingFieldId(fieldId);
    setEditingLabel(currentLabel);
  };

  const saveLabel = (fieldId) => {
    const updatedFields = selectedFields.map(field =>
      field.id === fieldId ? { ...field, label: editingLabel } : field
    );
    onFieldsChange(updatedFields);
    setEditingFieldId(null);
    setEditingLabel('');
  };

  const cancelEdit = () => {
    setEditingFieldId(null);
    setEditingLabel('');
  };

  const setEditingText = (text) => {
    setEditingLabel(text);
  };

  // Filter out already selected fields from available fields
  const unselectedFields = availableFields.filter(field => 
    !selectedFields.some(selected => selected.id === field.id)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Available Fields */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Available Fields
        </h3>
        
        <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {unselectedFields.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              All fields have been selected
            </p>
          ) : (
            <div className="space-y-2">
              {unselectedFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white border border-slate-200 rounded-lg p-3 hover:border-hawaii-ocean hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => addField(field)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{field.name}</div>
                      <div className="text-xs text-slate-500">{field.type}</div>
                      {field.description && (
                        <div className="text-xs text-slate-400 mt-1">{field.description}</div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Fields */}
      <div className="space-y-4">
        <h3 className="font-medium text-slate-800 flex items-center gap-2">
          <GripVertical className="w-4 h-4" />
          Selected Fields ({selectedFields.length})
        </h3>
        
        <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          {selectedFields.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              Click fields on the left to add them to your report
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedFields.map(field => field.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {selectedFields.map((field) => (
                    <SortableFieldItem
                      key={field.id}
                      field={field}
                      onRemove={removeField}
                      onEditLabel={editLabel}
                      isEditing={editingFieldId === field.id}
                      editingLabel={editingLabel}
                      onSetEditing={setEditingText}
                      onSaveLabel={saveLabel}
                      onCancelEdit={cancelEdit}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldSelector;
