import React from 'react';

interface LinkRendererProps {
  value: string;
}

const LinkRenderer: React.FC<LinkRendererProps> = ({ value }) => {
  return (
    <a href={`https://${value}`} target="_blank" rel="noopener noreferrer">
      {value}
    </a>
  );
};

export default LinkRenderer;
