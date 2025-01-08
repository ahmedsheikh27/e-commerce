import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://ap-south-1.cdn.hygraph.com/content/cm4l3i0i601mk07ush0h2o6fy/master",
  cache: new InMemoryCache(),
});

export const fetchProducts = async () => {
  try {
    const { data } = await client.query({
      query: gql`
          query AllProducts {
                products {
                    id
                    name
                    price
                    description
                    productImage {
                    url
                    }
                }
            }
        `,
    });
    return data.products;
  } catch (error) {
    console.error("Apollo Client Error:", error); // Log full error
    throw error; // Re-throw to handle in the calling component
  }
};


//   export const fetchProductByID = async (id: any) => {
//     const { data } = await client.query({
//       query: gql`
//        query fetchProductById {
//                 product(where: {id: $id}) {
//                     name
//                     price
//                     description
//                     productImage {
//                     url
//                     }
//                 }
//             }
//       `,
//       variables: { id },
//     });

//     return data.product;
//   };

export const fetchProductByID = async (id:any) => {
  console.log("Fetching product with ID:", id); // Debug the ID being passed
  const { data } = await client.query({
    query: gql`
      query GetProductByID($id: ID!) {
        product(where: { id: $id }) {
          id
          name
          price
          description
          productImage {
            url
          }
        }
      }
    `,
    variables: { id },
  });

  console.log("Fetched product data:", data); // Debug fetched data
  return data.product;
};


// update active cart with product
export const addToCart = async ({ cartId, productId, quantity, price }:any) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
          mutation AddToCart($cartId: ID!, $productId: ID, $quantity: Int!, $price: Float!) {
            updateCart(
              where: { id: $cartId }
              data: {
                orderItem: {
                  create: {
                    orderItemProduct: { connect: { id: $productId} }
                    quantity: $quantity
                    price: $price
                  }
                }
              }
            ) {
              id
              orderItem {
                orderItemProduct {
                  name
                  price
                  productImage {
                    url
                  }
                }
                quantity
              }
              totalPrice
            }
          }
        `,
      variables: { cartId, productId, quantity, price },
    });
    return data.updateCart;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
};


// creating cart by adding product
export const createCart = async ({ productId, quantity, price, totalPrice }: any) => {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation createCartItems($productId: ID!, $price: Float!, $totalPrice: Float!, $quantity: Int!) {
          createCart(
            data: {
              orderItem: {
                create: {
                  orderItemProduct: { connect: { id: $productId } },
                  quantity: $quantity,
                  price: $price
                }
              },
              totalPrice: $totalPrice
            }
          ) {
            id
            orderItem {
              id
              quantity
              orderItemProduct {
                name
                price
                description
                productImage {
                  url
                }
              }
              price
            }
            totalPrice
          }
        }
      `,
      variables: { productId, quantity, price, totalPrice }, 
    });

    console.log("Cart created successfully:", data.createCart);
    return data.createCart;
  } catch (error) {
    console.error("Error during createCart:", error);
    throw error;
  }
};


// export const createCart = async ({ id, quantity, price, totalPrice }: any) => {
//   try {
//     const { data } = await client.mutate({
//       mutation: gql`
//        mutation createCartItems($totalPrice: Float!, $id: ID!) {
//           createCart(data: {orderItem: {connect: {id: $id}}, totalPrice: $totalPrice}) {
//             id
//             orderItem {
//               id
//               quantity
//               orderItemProduct {
//                 name
//                 price
//                 description
//                 productImage {
//                   url
//                 }
//               }
//               price
//             }
//             totalPrice
//           }
//         }
//       `,
//       variables: { id, quantity, price, totalPrice },
//     });
//     return data.createCart;
//   } catch (error) {
//     console.error('Error creating cart:', error);
//     throw error;
//   }
// }

// export const createCart = async () => {
//   try {
//     const { data } = await client.mutate({
//       mutation: gql`
//         mutation CreateCart {
//           createCart {
//             id
//             orderItem {
//               orderItemProduct {
//                 name
//                 price
//                 productImage {
//                   url
//                 }
//               }
//               quantity
//             }
//             totalPrice
//           }
//         }
//       `,
//     });
//     return data.createCart;
//   } catch (error) {
//     console.error('Error creating cart:', error);
//     throw error;
//   }
// }; 