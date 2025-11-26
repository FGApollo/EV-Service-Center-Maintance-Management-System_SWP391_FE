import React, { useMemo, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExchangeAlt } from 'react-icons/fa';
import './MaintenanceChecklist.css';

/**
 * Parse description từ service type thành structured checklist
 * Format: 
 * 1. Section Title
 *    Item 1 (no bullet)
 *    Item 2
 * 2. Another Section
 *    Item 3
 */
const parseDescription = (description) => {
  if (!description) return [];
  
  // Nếu là string, split theo newline
  const lines = typeof description === 'string' 
    ? description.split('\n').map(l => l.trim())
    : Array.isArray(description) 
      ? description.map(l => typeof l === 'string' ? l.trim() : String(l))
      : [];
  
  // Filter empty lines but keep structure
  const nonEmptyLines = lines.filter(l => l);
  
  const sections = [];
  let currentSection = null;
  
  nonEmptyLines.forEach((line) => {
    // Check if line is a section title (starts with number and dot)
    const sectionMatch = line.match(/^(\d+)\.\s*(.+)$/);
    
    if (sectionMatch) {
      // Save previous section if exists
      if (currentSection && currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        number: parseInt(sectionMatch[1]),
        title: sectionMatch[2],
        items: []
      };
    } else if (currentSection) {
      // Any non-empty line after a section title is an item
      // Remove bullet points if present, but also accept plain text
      const trimmed = line.replace(/^[•\-\*]\s*/, '').trim();
      if (trimmed && !trimmed.match(/^\d+\./)) { // Don't treat numbered lines as items if they look like section headers
        currentSection.items.push(trimmed);
      }
    } else {
      // If no section yet, create a default one
      if (!currentSection) {
        currentSection = {
          number: 1,
          title: 'Công việc bảo dưỡng',
          items: []
        };
      }
      const trimmed = line.replace(/^[•\-\*]\s*/, '').trim();
      if (trimmed && !trimmed.match(/^\d+\./)) {
        currentSection.items.push(trimmed);
      }
    }
  });
  
  // Add last section
  if (currentSection && currentSection.items.length > 0) {
    sections.push(currentSection);
  }
  
  return sections;
};

// Extract model from vehicle model string (e.g., "Loin Model A" -> "Model A")
const extractModelFromVehicle = (vehicleModel) => {
  if (!vehicleModel) return null;
  // Tìm "Model A", "Model B", "Model C" trong tên xe
  const modelMatch = vehicleModel.match(/Model\s+[A-Z]/i);
  if (modelMatch) {
    return modelMatch[0].trim(); // "Model A", "Model B", "Model C"
  }
  return null;
};

const MaintenanceChecklist = ({
  serviceDescription,
  serviceName,
  checklist = [],
  vehicleConditions = {},
  onChecklistChange,
  onVehicleConditionChange,
  onReplaceClick,
  remarks = '',
  onRemarksChange,
  vehicleModel = null // Thêm prop vehicleModel
}) => {

  // Parse description into sections
  const sections = useMemo(() => {
    return parseDescription(serviceDescription);
  }, [serviceDescription]);


  // Initialize checklist state from sections
  useEffect(() => {
    if (sections.length > 0 && checklist.length === 0) {
      const initialChecklist = sections.flatMap(section => 
        section.items.map(item => ({
          section: section.title,
          item: item,
          completed: false,
          needsReplacement: false
        }))
      );
      onChecklistChange(initialChecklist);
    }
  }, [sections]);

  const handleToggleItem = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    onChecklistChange(newChecklist);
  };

  const handleToggleReplacement = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].needsReplacement = !newChecklist[index].needsReplacement;
    onChecklistChange(newChecklist);
    
    // Call onReplaceClick callback if provided
    if (onReplaceClick && newChecklist[index].needsReplacement) {
      onReplaceClick(newChecklist[index]);
    }
  };

  const handleVehicleConditionChange = (index, value) => {
    onVehicleConditionChange(index, value);
  };


  if (sections.length === 0) {
    return (
      <div className="maintenance-checklist-empty">
        <p>Không có checklist cho dịch vụ này</p>
      </div>
    );
  }

  return (
    <div className="maintenance-checklist">
      <div className="checklist-header">
        <h3>{serviceName || 'Checklist bảo dưỡng'}</h3>
      </div>

      {/* Checklist Sections */}
      <div className="checklist-sections">
        {sections.map((section, sectionIndex) => {
          const sectionItems = checklist.filter(item => item.section === section.title);
          
          return (
            <div key={sectionIndex} className="checklist-section">
              <h4 className="section-title">
                {section.number}. {section.title}
              </h4>
              
              <div className="checklist-items">
                {sectionItems.map((checklistItem, itemIndex) => {
                  const globalIndex = checklist.findIndex(
                    item => item.section === section.title && item.item === checklistItem.item
                  );
                  
                  return (
                    <div key={itemIndex} className="checklist-item-row">
                      {/* Checkbox */}
                      <div className="checklist-item-checkbox">
                        <button
                          type="button"
                          className={`checkbox-btn ${checklistItem.completed ? 'checked' : ''}`}
                          onClick={() => handleToggleItem(globalIndex)}
                        >
                          {checklistItem.completed ? (
                            <FaCheckCircle className="check-icon" />
                          ) : (
                            <FaTimesCircle className="uncheck-icon" />
                          )}
                        </button>
                      </div>

                      {/* Item Text */}
                      <div className="checklist-item-text">
                        {checklistItem.item}
                      </div>

                      {/* Vehicle Condition Input */}
                      <div className="checklist-item-condition">
                        <input
                          type="text"
                          placeholder="Tình trạng..."
                          value={vehicleConditions[globalIndex] || ''}
                          onChange={(e) => handleVehicleConditionChange(globalIndex, e.target.value)}
                          className="condition-input"
                        />
                      </div>

                      {/* Replace Button */}
                      <div className="checklist-item-replace">
                        <button
                          type="button"
                          className={`replace-btn ${checklistItem.needsReplacement ? 'active' : ''}`}
                          onClick={() => handleToggleReplacement(globalIndex)}
                          title="Cần thay thế"
                        >
                          <FaExchangeAlt />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default MaintenanceChecklist;

