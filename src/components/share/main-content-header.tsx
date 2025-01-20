import { type BaseProps } from "~/interface/index";

const MainContentHeader = ({ children }: BaseProps) => {
  return (
    <div className="absolute -mt-7 ml-12">
      {children}
    </div>
  );
};

export default MainContentHeader;