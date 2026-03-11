import { useIsFetching } from "@tanstack/react-query";
import DelayedLoading from "./DelayLoading";

const GlobalLoading = () => {
  const isFetching = useIsFetching();

  return <DelayedLoading loading={isFetching > 0} minDuration={700} />;
};

export default GlobalLoading;