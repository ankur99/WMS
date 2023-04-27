import ProductRequestBasicInfo from "../../Components/ProductRequest/ProductRequestBasicInfo";
import { ProductRequestComingFrom } from "../../types/productRequestTypes";

const CreateProductRequest = () => {
  return (
    <div>
      <ProductRequestBasicInfo comingFrom={ProductRequestComingFrom.CREATE} />
    </div>
  );
};

export default CreateProductRequest;
