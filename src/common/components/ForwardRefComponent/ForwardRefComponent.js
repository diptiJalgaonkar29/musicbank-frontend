import React from "react";

const ForwardRefComponent = React.forwardRef(function MyComponent(props, ref) {
  const { children, ...other } = props;
  return (
    <div {...other} ref={ref}>
      {children}
    </div>
  );
});

export default ForwardRefComponent;
