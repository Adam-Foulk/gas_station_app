import { FC } from 'react';
import '../styles/CheckTable.css';

type CheckTableProps = {
  data: CheckType;
};

const CheckTable: FC<CheckTableProps> = ({ data }) => {
  return (
    <div className={'CheckTable'}>
      <div className={'Common'}>
        <div>
          <div>Operator</div>
          <div>{((data.order as OrderType).user as UserType).name}</div>
        </div>
        <div>
          <div>Cash desk</div>
          <div>{(data.order as OrderType).cash_desk}</div>
        </div>
        <div>
          <div>Payment method</div>
          <div>{data.payment_method}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Station</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {((data.order as OrderType).products as ProductType[]).map((product) => (
            <tr key={product.name}>
              <td>{product.name}</td>
              <td>{product.quantity?.toFixed(2)}</td>
              <td>{product.price.toFixed(2)}</td>
              <td>{product.station}</td>
              <td>{(product.price * (product.quantity || 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={4}>Total</th>
            <td colSpan={2}>
              {((data.order as OrderType).products as ProductType[])
                .reduce((acc, product) => (acc += (product.quantity || 1) * product.price), 0)
                .toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CheckTable;
