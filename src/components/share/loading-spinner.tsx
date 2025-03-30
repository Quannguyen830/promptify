import CustomLoading1 from "./loader/custom-loading-1"

const Loading: React.FC<BaseProps> = ({ className }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <CustomLoading1 />
    </div>
  )
}
export default Loading;

