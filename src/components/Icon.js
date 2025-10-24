export default function Icon({ color, width, height, children, viewbox }) {
  return (
    <svg
      fill={color}
      version="1.0"
      id="Layer_1"
      width={width ?? height ?? 18}
      height={height ?? width ?? 18}
      viewBox={viewbox ?? "0 0 64 64"}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        lineHeight: 0,
        verticalAlign: 'middle'
      }}
    >
      {children}
    </svg>
  );
}
