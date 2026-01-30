import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const FilterBuilder = ({ fields, filters, onFiltersChange }) => {
  const [expandedGroups, setExpandedGroups] = useState([0]);

  const getOperatorsForFieldType = (fieldType) => {
    switch (fieldType) {
      case 'string':
      case 'text':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'startsWith', label: 'Starts with' },
          { value: 'endsWith', label: 'Ends with' }
        ];
      case 'number':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not equals' },
          { value: 'greaterThan', label: 'Greater than' },
          { value: 'lessThan', label: 'Less than' },
          { value: 'between', label: 'Between' }
        ];
      case 'date':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not equals' },
          { value: 'before', label: 'Before' },
          { value: 'after', label: 'After' },
          { value: 'between', label: 'Between' }
        ];
      case 'boolean':
        return [
          { value: 'equals', label: 'Equals' }
        ];
      default:
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not equals' },
          { value: 'contains', label: 'Contains' }
        ];
    }
  };

  const addFilter = (groupIndex = 0) => {
    const newFilter = {
      id: `filter_${Date.now()}_${Math.random()}`,
      field: '',
      operator: 'equals',
      value: '',
      group: groupIndex,
      logic: 'AND' // AND or OR for grouping
    };

    onFiltersChange([...filters, newFilter]);
  };

  const removeFilter = (filterId) => {
    onFiltersChange(filters.filter(filter => filter.id !== filterId));
  };

  const updateFilter = (filterId, updates) => {
    onFiltersChange(filters.map(filter =>
      filter.id === filterId ? { ...filter, ...updates } : filter
    ));
  };

  const addFilterGroup = () => {
    const newGroupIndex = Math.max(...filters.map(f => f.group), 0) + 1;
    addFilter(newGroupIndex);
    setExpandedGroups([...expandedGroups, newGroupIndex]);
  };

  const removeFilterGroup = (groupIndex) => {
    onFiltersChange(filters.filter(filter => filter.group !== groupIndex));
    setExpandedGroups(expandedGroups.filter(index => index !== groupIndex));
  };

  const toggleGroupExpansion = (groupIndex) => {
    setExpandedGroups(expandedGroups.includes(groupIndex)
      ? expandedGroups.filter(index => index !== groupIndex)
      : [...expandedGroups, groupIndex]
    );
  };

  const getGroupedFilters = () => {
    const groups = {};
    filters.forEach(filter => {
      if (!groups[filter.group]) {
        groups[filter.group] = [];
      }
      groups[filter.group].push(filter);
    });
    return groups;
  };

  const groupedFilters = getGroupedFilters();
  const groupIndexes = Object.keys(groupedFilters).map(Number).sort((a, b) => a - b);

  const renderValueInput = (filter, field) => {
    if (!field) {
      return (
        <input
          type="text"
          placeholder="Select a field first"
          disabled
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400"
        />
      );
    }

    switch (field.type) {
      case 'number':
        if (filter.operator === 'between') {
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filter.value?.min || ''}
                onChange={(e) => updateFilter(filter.id, { 
                  value: { ...filter.value, min: e.target.value } 
                })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
              />
              <span className="text-slate-500">and</span>
              <input
                type="number"
                placeholder="Max"
                value={filter.value?.max || ''}
                onChange={(e) => updateFilter(filter.id, { 
                  value: { ...filter.value, max: e.target.value } 
                })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
              />
            </div>
          );
        }
        return (
          <input
            type="number"
            placeholder="Enter value"
            value={filter.value || ''}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
          />
        );

      case 'date':
        if (filter.operator === 'between') {
          return (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filter.value?.min || ''}
                onChange={(e) => updateFilter(filter.id, { 
                  value: { ...filter.value, min: e.target.value } 
                })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
              />
              <span className="text-slate-500">and</span>
              <input
                type="date"
                value={filter.value?.max || ''}
                onChange={(e) => updateFilter(filter.id, { 
                  value: { ...filter.value, max: e.target.value } 
                })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
              />
            </div>
          );
        }
        return (
          <input
            type="date"
            value={filter.value || ''}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <select
            value={filter.value || ''}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
          >
            <option value="">Select value</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );

      default:
        if (field.options) {
          return (
            <select
              value={filter.value || ''}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
            >
              <option value="">Select value</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            placeholder="Enter value"
            value={filter.value || ''}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-800">Filters</h3>
        <div className="flex gap-2">
          <button
            onClick={() => addFilter()}
            className="px-3 py-1 text-sm bg-hawaii-ocean text-white rounded hover:bg-blue-800 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Filter
          </button>
          <button
            onClick={addFilterGroup}
            className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add Group
          </button>
        </div>
      </div>

      {groupIndexes.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-500">No filters added yet. Click "Add Filter" to create conditions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupIndexes.map((groupIndex, groupIdx) => (
            <div key={groupIndex} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200 cursor-pointer"
                onClick={() => toggleGroupExpansion(groupIndex)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">
                    Filter Group {groupIdx + 1}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({groupedFilters[groupIndex].length} filter{groupedFilters[groupIndex].length !== 1 ? 's' : ''})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {groupIndexes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFilterGroup(groupIndex);
                      }}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {expandedGroups.includes(groupIndex) ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {expandedGroups.includes(groupIndex) && (
                <div className="p-4 space-y-3">
                  {groupedFilters[groupIndex].map((filter, filterIdx) => {
                    const field = fields.find(f => f.id === filter.field);
                    const operators = getOperatorsForFieldType(field?.type);

                    return (
                      <div key={filter.id} className="flex items-center gap-3">
                        <select
                          value={filter.field}
                          onChange={(e) => updateFilter(filter.id, { 
                            field: e.target.value,
                            operator: 'equals',
                            value: ''
                          })}
                          className="w-48 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent"
                        >
                          <option value="">Select field</option>
                          {fields.map(field => (
                            <option key={field.id} value={field.id}>
                              {field.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={filter.operator}
                          onChange={(e) => updateFilter(filter.id, { 
                            operator: e.target.value,
                            value: ''
                          })}
                          disabled={!field}
                          className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hawaii-ocean focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          {operators.map(op => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>

                        {renderValueInput(filter, field)}

                        <button
                          onClick={() => removeFilter(filter.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => addFilter(groupIndex)}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-hawaii-ocean hover:text-hawaii-ocean transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add Filter to Group
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBuilder;
