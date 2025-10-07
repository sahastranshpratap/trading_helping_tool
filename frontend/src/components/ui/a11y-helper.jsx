import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Eye, EyeOff, Glasses } from 'lucide-react';

/**
 * A11yHelper - A utility component for checking accessibility issues
 * 
 * This component scans the page for common accessibility issues and provides
 * useful feedback for developers.
 */
export function A11yHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({
    issues: [],
    passed: [],
    scanning: false
  });
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  // Run accessibility checks
  const runChecks = () => {
    setResults(prev => ({ ...prev, scanning: true, issues: [], passed: [] }));
    
    setTimeout(() => {
      const issues = [];
      const passed = [];
      
      // Check 1: Images without alt text
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])'));
      if (imagesWithoutAlt.length > 0) {
        issues.push({
          id: 'img-alt',
          name: 'Images without alt text',
          count: imagesWithoutAlt.length,
          elements: imagesWithoutAlt,
          severity: 'error',
          description: 'All images must have alt attributes for screen readers'
        });
      } else {
        passed.push({
          id: 'img-alt',
          name: 'Images have alt text'
        });
      }
      
      // Check 2: Buttons without accessible name
      const buttonsWithoutName = Array.from(document.querySelectorAll('button'))
        .filter(button => {
          const hasText = button.innerText.trim().length > 0;
          const hasAriaLabel = button.hasAttribute('aria-label');
          const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
          return !hasText && !hasAriaLabel && !hasAriaLabelledBy;
        });
        
      if (buttonsWithoutName.length > 0) {
        issues.push({
          id: 'button-name',
          name: 'Buttons without accessible name',
          count: buttonsWithoutName.length,
          elements: buttonsWithoutName,
          severity: 'error',
          description: 'Buttons must have text content, aria-label, or aria-labelledby'
        });
      } else {
        passed.push({
          id: 'button-name',
          name: 'Buttons have accessible names'
        });
      }
      
      // Check 3: Color contrast (simplified check)
      const lowContrastElements = []; 
      // Note: A proper contrast check would require parsing CSS which is complex
      // For a real implementation, consider using a library like axe-core
      
      if (lowContrastElements.length > 0) {
        issues.push({
          id: 'color-contrast',
          name: 'Low color contrast',
          count: lowContrastElements.length,
          elements: lowContrastElements,
          severity: 'warning',
          description: 'Text should have sufficient contrast with its background'
        });
      } else {
        passed.push({
          id: 'color-contrast',
          name: 'Color contrast appears sufficient'
        });
      }
      
      // Check 4: Heading levels
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const headingLevels = headings.map(h => parseInt(h.tagName.substring(1)));
      
      let headingIssue = false;
      if (headingLevels.length > 0) {
        // Check if h1 exists
        if (!headingLevels.includes(1)) {
          headingIssue = true;
          issues.push({
            id: 'heading-h1',
            name: 'Missing H1',
            count: 1,
            elements: [],
            severity: 'warning',
            description: 'Each page should have an H1 heading'
          });
        }
        
        // Check for skipped levels (e.g. h2 to h4 without h3)
        let prevLevel = 0;
        const sortedLevels = [...headingLevels].sort((a, b) => a - b);
        for (const level of sortedLevels) {
          if (level > prevLevel + 1 && prevLevel !== 0) {
            headingIssue = true;
            issues.push({
              id: 'heading-order',
              name: 'Skipped heading level',
              count: 1,
              elements: [],
              severity: 'warning',
              description: 'Heading levels should not be skipped (e.g. from h2 to h4)'
            });
            break;
          }
          prevLevel = level;
        }
      }
      
      if (!headingIssue) {
        passed.push({
          id: 'headings',
          name: 'Heading structure is proper'
        });
      }
      
      // Check 5: Form inputs without labels
      const inputsWithoutLabels = Array.from(document.querySelectorAll('input, select, textarea')).filter(input => {
        const id = input.getAttribute('id');
        if (!id) return true;
        
        const hasLabelElement = document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.hasAttribute('aria-label');
        const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
        
        return !hasLabelElement && !hasAriaLabel && !hasAriaLabelledBy;
      });
      
      if (inputsWithoutLabels.length > 0) {
        issues.push({
          id: 'input-labels',
          name: 'Form controls without labels',
          count: inputsWithoutLabels.length,
          elements: inputsWithoutLabels,
          severity: 'error',
          description: 'All form controls must be associated with labels'
        });
      } else {
        passed.push({
          id: 'input-labels',
          name: 'Form controls have labels'
        });
      }
      
      // Check 6: ARIA roles
      const invalidAriaRoles = Array.from(document.querySelectorAll('[role]')).filter(el => {
        const role = el.getAttribute('role');
        const validRoles = [
          'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox', 
          'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 
          'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 
          'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 
          'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 
          'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 
          'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton', 
          'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 
          'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
        
        return !validRoles.includes(role);
      });
      
      if (invalidAriaRoles.length > 0) {
        issues.push({
          id: 'aria-roles',
          name: 'Invalid ARIA roles',
          count: invalidAriaRoles.length,
          elements: invalidAriaRoles,
          severity: 'error',
          description: 'ARIA roles must be valid'
        });
      } else {
        passed.push({
          id: 'aria-roles',
          name: 'ARIA roles are valid'
        });
      }
      
      setResults({
        issues,
        passed,
        scanning: false
      });
    }, 1000);
  };
  
  // Highlight an element on the page
  const highlightElement = (element) => {
    if (!element) return;
    
    // Save original styles
    const originalOutline = element.style.outline;
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    
    // Apply highlight
    element.style.outline = '3px solid red';
    document.documentElement.style.scrollBehavior = 'smooth';
    element.scrollIntoView({ block: 'center' });
    
    // Remove highlight after a delay
    setTimeout(() => {
      element.style.outline = originalOutline;
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    }, 2000);
  };
  
  // Run initial scan when component mounts
  useEffect(() => {
    if (isOpen) {
      runChecks();
    }
  }, [isOpen]);
  
  // Color coding by severity
  const severityColors = {
    error: {
      icon: XCircle,
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800/30'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-200 dark:border-yellow-800/30'
    },
    info: {
      icon: CheckCircle,
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800/30' 
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-80 md:w-96 max-h-[80vh] flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Glasses className="w-4 h-4 mr-2" />
              Accessibility Inspector
            </h3>
            <div className="flex space-x-1">
              <button 
                onClick={runChecks}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1"
                aria-label="Run accessibility check"
                disabled={results.scanning}
              >
                {results.scanning ? (
                  <div className="animate-spin w-4 h-4 border-2 border-gray-500 dark:border-gray-400 border-t-transparent dark:border-t-transparent rounded-full"></div>
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
              <button 
                onClick={toggleOpen}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1"
                aria-label="Close accessibility helper"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto p-3 flex-1">
            {results.scanning ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent mb-3"></div>
                <p className="text-gray-600 dark:text-gray-300">Scanning page for accessibility issues...</p>
              </div>
            ) : (
              <>
                {results.issues.length === 0 && results.passed.length > 0 ? (
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-800/30 mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-400 mr-2" />
                      <p className="text-green-800 dark:text-green-300 font-medium">No issues detected!</p>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      This page passes basic accessibility checks.
                    </p>
                  </div>
                ) : null}
                
                {results.issues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Issues Found ({results.issues.length})</h4>
                    <div className="space-y-3">
                      {results.issues.map(issue => {
                        const SeverityIcon = severityColors[issue.severity].icon;
                        return (
                          <div 
                            key={issue.id}
                            className={`p-3 rounded-md border ${severityColors[issue.severity].bg} ${severityColors[issue.severity].text} ${severityColors[issue.severity].border}`}
                          >
                            <div className="flex items-start">
                              <SeverityIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                              <div>
                                <h5 className="font-medium">{issue.name}</h5>
                                <p className="text-sm mt-1">{issue.description}</p>
                                {issue.elements && issue.elements.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-xs font-medium">Found {issue.count} instance{issue.count !== 1 ? 's' : ''}</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {issue.elements.slice(0, 5).map((el, i) => (
                                        <button
                                          key={i}
                                          onClick={() => highlightElement(el)}
                                          className="text-xs px-2 py-1 rounded bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30"
                                          aria-label={`Highlight element ${i+1}`}
                                        >
                                          Element {i+1}
                                        </button>
                                      ))}
                                      {issue.elements.length > 5 && (
                                        <span className="text-xs px-2 py-1">+{issue.elements.length - 5} more</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {results.passed.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Passed Checks ({results.passed.length})</h4>
                    <ul className="space-y-1">
                      {results.passed.map(check => (
                        <li key={check.id} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {check.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            Note: This is a basic scan. For thorough testing, use specialized tools like axe, WAVE, or Lighthouse.
          </div>
        </div>
      ) : (
        <button
          onClick={toggleOpen}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Check accessibility"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}
    </div>
  );
} 