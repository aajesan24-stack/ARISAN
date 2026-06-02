import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Edit2, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';

interface EditableElementProps {
  id: string;
  defaultText?: string;
  defaultTextBn?: string;
  type?: 'text' | 'heading' | 'button' | 'image' | 'container' | 'card';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const EditableElement: React.FC<EditableElementProps> = ({
  id,
  defaultText,
  defaultTextBn,
  type = 'text',
  children,
  className = '',
  style = {}
}) => {
  const {
    settings,
    isVisualEditMode,
    setSelectedEditableId,
    language,
    currentUser
  } = useApp();

  const [isHovered, setIsHovered] = useState(false);

  // Read customization settings
  const custom = settings?.editableElements?.[id];

  // Resolve Visibility
  const isVisible = custom?.visible !== false;

  // If hidden on user site, don't render anything
  if (!isVisible && !isVisualEditMode) {
    return null;
  }

  // Determine Active Text
  let activeText = language === 'bn' 
    ? (custom?.textBn || defaultTextBn || '') 
    : (custom?.text || defaultText || '');

  // If no default text given, and no customization, fall back to children
  const hasCustomText = language === 'bn' 
    ? !!custom?.textBn 
    : !!custom?.text;

  // Create combined styling objects
  let elementStyles: React.CSSProperties = { ...style };

  if (custom) {
    if (custom.fontFamily) elementStyles.fontFamily = `"${custom.fontFamily}", sans-serif`;
    if (custom.fontSize) elementStyles.fontSize = custom.fontSize;
    if (custom.fontWeight) elementStyles.fontWeight = custom.fontWeight;
    if (custom.textColor) elementStyles.color = custom.textColor;
    if (custom.bgColor) elementStyles.backgroundColor = custom.bgColor;
    if (custom.borderColor) elementStyles.borderColor = custom.borderColor;
    if (custom.borderWidth) elementStyles.borderWidth = custom.borderWidth;
    if (custom.borderStyle) elementStyles.borderStyle = custom.borderStyle;
    if (custom.borderRadius) elementStyles.borderRadius = custom.borderRadius;
    if (custom.width) elementStyles.width = custom.width;
    if (custom.height) elementStyles.height = custom.height;
    if (custom.margin) elementStyles.margin = custom.margin;
    if (custom.padding) elementStyles.padding = custom.padding;
    if (custom.top) elementStyles.top = custom.top;
    if (custom.bottom) elementStyles.bottom = custom.bottom;
    if (custom.left) elementStyles.left = custom.left;
    if (custom.right) elementStyles.right = custom.right;
    if (custom.position) elementStyles.position = custom.position as any;
    if (custom.alignment) elementStyles.textAlign = custom.alignment as any;
    if (custom.opacity !== undefined) elementStyles.opacity = custom.opacity;
    if (custom.boxShadow) elementStyles.boxShadow = custom.boxShadow;
    
    // Apply Hover Styles
    if (isHovered && custom.hoverStyles) {
      if (custom.hoverStyles.textColor) elementStyles.color = custom.hoverStyles.textColor;
      if (custom.hoverStyles.bgColor) elementStyles.backgroundColor = custom.hoverStyles.bgColor;
      if (custom.hoverStyles.scale) elementStyles.transform = `scale(${custom.hoverStyles.scale})`;
    }
  }

  // Animation CSS classes
  let animationClass = '';
  if (custom?.animation && custom.animation !== 'none') {
    if (custom.animation === 'bounce') animationClass = 'animate-bounce';
    else if (custom.animation === 'pulse') animationClass = 'animate-pulse';
    else if (custom.animation === 'ping') animationClass = 'animate-ping';
    else if (custom.animation === 'spin') animationClass = 'animate-spin';
  }

  // Dynamic Icon rendering
  const renderIcon = () => {
    if (!custom?.icon || custom.icon === 'none') return null;
    const IconComponent = (Icons as any)[custom.icon];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 inline-block" />;
    }
    return null;
  };

  // Determine wrapper border colors & edit styling overlay when Admin is in edit state
  const editOverlayClasses = isVisualEditMode && currentUser?.role === 'admin'
    ? `relative group/edit cursor-pointer border-2 ${
        !isVisible 
          ? 'border-dashed border-red-500 opacity-60 bg-red-500/10' 
          : 'border-dashed border-amber-400/40 hover:border-amber-400 hover:bg-amber-400/5'
      } transition-colors p-1 rounded-md`
    : '';

  const handleElementClick = (e: React.MouseEvent) => {
    if (isVisualEditMode && currentUser?.role === 'admin') {
      e.stopPropagation();
      e.preventDefault();
      setSelectedEditableId(id);
    }
  };

  // Render responsive classes based on configuration
  const responsiveClasses = [];
  if (custom?.responsive) {
    if (custom.responsive.mobileShow === false) responsiveClasses.push('hidden sm:block');
    if (custom.responsive.tabletShow === false) responsiveClasses.push('sm:hidden md:block');
    if (custom.responsive.desktopShow === false) responsiveClasses.push('md:hidden lg:block');
  }
  const responsiveClassStr = responsiveClasses.join(' ');

  // Underpin elements based on the requested tag
  const renderContent = () => {
    const iconNode = renderIcon();

    if (type === 'image') {
      const activeSrc = custom?.imageUrl || (children as any)?.props?.src || '';
      return (
        <img
          src={activeSrc}
          alt={defaultText || "Customizable Image"}
          style={elementStyles}
          className={`${className} ${animationClass} transition-all max-w-full`}
          referrerPolicy="no-referrer"
        />
      );
    }

    if (React.isValidElement(children) && typeof children.type === 'string') {
      const childProps = children.props as any;
      const mergedStyle = { ...childProps.style, ...elementStyles };
      const mergedClassName = `${childProps.className || ''} ${className} ${animationClass}`.trim();
      
      let newChildren = childProps.children;
      if (hasCustomText || (activeText && !childProps.children)) {
        newChildren = (
          <>
            {iconNode}
            <span>{activeText}</span>
          </>
        );
      } else if (iconNode) {
        newChildren = (
          <>
            {iconNode}
            <span>{childProps.children}</span>
          </>
        );
      }

      return React.cloneElement(children as React.ReactElement<any>, {
        style: mergedStyle,
        className: mergedClassName,
        children: newChildren
      });
    }

    if (type === 'button') {
      return (
        <button
          style={elementStyles}
          className={`${className} ${animationClass} flex items-center justify-center gap-2 transition-all`}
        >
          {iconNode}
          <span>{hasCustomText ? activeText : (children ?? activeText)}</span>
        </button>
      );
    }

    return (
      <span
        style={elementStyles}
        className={`${className} ${animationClass} flex items-center gap-2`}
      >
        {iconNode}
        <span>{hasCustomText ? activeText : (children ?? activeText)}</span>
      </span>
    );
  };

  return (
    <div
      onClick={handleElementClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block ${editOverlayClasses} ${responsiveClassStr} transition-all`}
      title={isVisualEditMode && currentUser?.role === 'admin' ? `Click to customize Element [${id}]` : ''}
    >
      {/* Visual Admin indicators */}
      {isVisualEditMode && currentUser?.role === 'admin' && (
        <div className="absolute -top-3.5 -right-1 z-30 bg-amber-500 text-stone-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1 opacity-0 group-hover/edit:opacity-100 transition-opacity">
          <Edit2 className="w-2.5 h-2.5" />
          <span>Edit #{id}</span>
          {!isVisible && (
            <span className="bg-red-600 text-white px-1 rounded flex items-center gap-0.5">
              <EyeOff className="w-2 h-2" /> Hidden
            </span>
          )}
        </div>
      )}

      {renderContent()}
    </div>
  );
};
