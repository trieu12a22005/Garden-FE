function NavigateButton({ ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={`bg-primary text-white px-4 py-2 rounded ${props.className}`}
    >
      {props.children}
    </button>
  );
}
export default NavigateButton;
