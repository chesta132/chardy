export const Main = (props: Omit<React.ComponentProps<"main">, "id">) => {
  return <main id="main-content" {...props} />;
};
