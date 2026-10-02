import React from "react";
import { useCart } from "@/contexts/cartContext";
import { Trash } from "lucide-react";
import dirham from "@/assets/UAE_Dirham_Symbol.svg";

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const { items } = state;

  const increment = (id: string) => {
    dispatch({ type: "INCREMENT_QUANTITY", payload: { id } });
  };

  const decrement = (id: string) => {
    dispatch({ type: "DECREMENT_QUANTITY", payload: { id } });
  };

  const remove = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  console.log(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <span className="text-lg font-semibold text-gray-600">
          Your cart is empty.
        </span>
      </div>
    );
  }
  const checkoutOnWhatsApp = () => {
    let message = `Hello, I would like to place an order:%0A%0A`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}%0A`;
      message += `Qty: ${item.quantity}%0A`;
      message += `Price: ${item.price.toFixed(2)} AED%0A`;
      message += `Subtotal: ${(item.price * item.quantity).toFixed(2)} AED%0A%0A`;
    });

    message += `Total: ${total.toFixed(2)} AED`;

    const phoneNumber = "+971585061377"; // Kuwait WhatsApp number
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <button
          onClick={clearCart}
          className="rounded-md bg-red-500 px-3 py-2 text-sm  transition-colors hover:bg-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map(({ id, name, price, quantity }) => (
          <div
            key={id}
            className="flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-row items-center justify-between gap-2 md:flex-col md:items-start md:justify-start md:gap-1">
              <div className="font-semibold text-gray-800">{name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                Unit Price:
                <img
                  src={dirham}
                  alt="Dirham"
                  className="mb-0.5 h-2.5 w-2.5 opacity-60"
                />
                {price.toFixed(2)}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 md:flex-nowrap md:justify-end">
              <div className="flex items-center rounded border px-2">
                <button
                  onClick={() => decrement(id)}
                  className="hover:text-primary px-2 py-0 text-lg text-gray-500"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-3 font-medium text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => increment(id)}
                  className="hover:text-primary px-2 py-0 text-lg text-gray-500"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                <img
                  src={dirham}
                  alt="Dirham"
                  className="h-3 w-3 brightness-75 contrast-125"
                />
                {(price * quantity).toFixed(2)}
              </div>
              <button
                onClick={() => remove(id)}
                className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200"
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end text-right">
        <span className="flex gap-1 text-xl font-semibold">
          Total:
          <img
            src={dirham}
            alt="Dirham"
            className="ms-1 mt-1.5 h-4 w-4 text-gray-500"
          />
          {total.toFixed(2)}
        </span>
        {/* Add checkout logic or button below */}
        <button
          onClick={checkoutOnWhatsApp}
          className="hover:bg-primary-dark ml-4 rounded-lg bg-[var(--color-purple)] px-6 py-2 font-bold  transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
