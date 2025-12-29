export enum PackageId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditsPack = {
  id: PackageId;
  priceId: string;
  name: string;
  label: string;
  credits: number;
  price: number;
};

export const creditsPackagesList: CreditsPack[] = [
  {
    id: PackageId.SMALL,
    priceId: "price_1SjlCkHFowWAhf7qbMLcxMiv",
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999,
  },
  {
    id: PackageId.MEDIUM,
    priceId: "price_1SjlDyHFowWAhf7qsCVB5uFg",
    name: "Medium Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 3999,
  },
  {
    id: PackageId.LARGE,
    priceId: "price_1SjlF7HFowWAhf7q0IPhXk4P",
    name: "Large Pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999,
  },
];

export const getCreditsPackage = (id: PackageId) =>
  creditsPackagesList.find((p) => p.id === id);
