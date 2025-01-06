import { BaseProps } from "~/app/constants/interfaces";

const MainContentHeader = ({ children } : BaseProps) => {
  return (
    <div className="absolute -mt-7 ml-12">
      {children}
    </div>
  );
};

export default MainContentHeader;