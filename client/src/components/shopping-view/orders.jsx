import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  fetchAllOrders,
  fetchOrderDetails,
} from "@/store/shop/order-slice";

function Orders() {
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shoppingOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(fetchOrderDetails({ userId: user?.id, orderId: getId }));
    setShowOrderDetails(true);
  }

  useEffect(() => {
    if (user?.id) dispatch(fetchAllOrders(user?.id));
  }, [dispatch, user]);

  useEffect(() => {
    if (!user?.id) navigate("/");
  }, [user]);

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-lg border p-8">
        <div className="grid gap-4">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          {orderList && orderList.length > 0 ? (
            orderList.map((order) => (
              <div
                key={order._id}
                className="grid gap-8 rounded-lg border p-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Order #{order._id}
                    </h2>
                    <Badge variant="outline">{order.orderStatus}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid gap-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.productId.image}
                        alt={item.productId.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium">
                          {item.productId.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          $
                          {item.productId.salePrice > 0
                            ? item.productId.salePrice * item.quantity
                            : item.productId.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleFetchOrderDetails(order._id)}
                  >
                    View Details
                  </Button>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium">Total:</p>
                    <p className="text-lg font-bold">
                      $
                      {order.items.reduce((total, item) => {
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
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No orders found</p>
          )}
        </div>
      </div>
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about your order
            </DialogDescription>
          </DialogHeader>
          {orderDetails && (
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold">Order Information</h3>
                  <Separator className="my-2" />
                  <div className="grid gap-1">
                    <p className="text-sm">
                      <span className="font-medium">Order ID:</span>{" "}
                      {orderDetails._id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Order Date:</span>{" "}
                      {new Date(
                        orderDetails.createdAt
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      {orderDetails.orderStatus}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Shipping Address</h3>
                  <Separator className="my-2" />
                  <div className="grid gap-1">
                    <p className="text-sm">
                      {orderDetails.addressId.address}
                    </p>
                    <p className="text-sm">
                      {orderDetails.addressId.city},{" "}
                      {orderDetails.addressId.pincode}
                    </p>
                    <p className="text-sm">
                      Phone: {orderDetails.addressId.phone}
                    </p>
                    {orderDetails.addressId.notes && (
                      <p className="text-sm">
                        Notes: {orderDetails.addressId.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Items</h3>
                  <Separator className="my-2" />
                  <div className="grid gap-4">
                    {orderDetails.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4"
                      >
                        <img
                          src={item.productId.image}
                          alt={item.productId.title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium">
                            {item.productId.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            $
                            {item.productId.salePrice > 0
                              ? item.productId.salePrice * item.quantity
                              : item.productId.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Order Summary</h3>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <p className="font-medium">Total</p>
                    <p className="font-bold">
                      $
                      {orderDetails.items.reduce((total, item) => {
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
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Orders;
