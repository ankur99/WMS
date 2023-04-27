import BasicInfo from "../../Components/Products/BasicInfo";
import { ProductComingFrom } from "../../types/ProductTypes";

const CreateProduct = () => {
  return (
    <div>
      <BasicInfo comingFrom={ProductComingFrom.CREATE} />
    </div>
  );
};

export default CreateProduct;
