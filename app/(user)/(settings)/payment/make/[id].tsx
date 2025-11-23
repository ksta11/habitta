import { useLocalSearchParams } from "expo-router";
import MakePayment from "../../../../../modules/payment/MakePayment";

export default function makePayment() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <MakePayment idPay={id || ''} />
  );
}