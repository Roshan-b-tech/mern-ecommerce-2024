import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createOrder } from "@/store/shop/order-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

  function handleCheckout() {
    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartItems: cartItems.items.map(item => ({
        productId: item.productId._id || item.productId,
        title: item.productId.title,
        image: item.productId.image,
        price: item.productId.salePrice > 0 ? item.productId.salePrice : item.productId.price,
        quantity: item.quantity
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        pincode: currentSelectedAddress.pincode,
        phone: currentSelectedAddress.phone || "",
        notes: currentSelectedAddress.notes || ""
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      cartId: cartItems._id
    };

    dispatch(createOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Order placed successfully",
        });
        dispatch(fetchCartItems(user?.id));
        navigate("/orders");
      } else {
        toast({
          title: "Failed to place order",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    }).catch(error => {
      toast({
        title: "Failed to place order",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    });
  }

  useEffect(() => {
    if (!user?.id) navigate("/");
  }, [user]);

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-10">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems?.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded">
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.productId.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    $
                    {item.productId.salePrice > 0
                      ? item.productId.salePrice * item.quantity
                      : item.productId.price * item.quantity}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-4">
                <p className="font-medium">Total</p>
                <p className="font-medium">
                  $
                  {cartItems?.items?.reduce((total, item) => {
                    return (
                      total +
                      (item.productId.salePrice > 0
                        ? item.productId.salePrice * item.quantity
                        : item.productId.price * item.quantity)
                    );
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Address
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          selectedId={currentSelectedAddress}
        />
        <Button onClick={handleCheckout} className="w-full">
          Place Order
        </Button>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
