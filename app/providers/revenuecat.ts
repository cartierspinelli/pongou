import Purchases, {
  PurchasesConfiguration,
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases"
import { SubscriptionProvider, PurchaseProduct, Entitlement } from "./types"

export class RevenueCatProvider implements SubscriptionProvider {
  async initialize(config: PurchasesConfiguration) {
    await Purchases.configure(config)
  }

  async getProducts(): Promise<PurchaseProduct[]> {
    try {
      const offerings = await Purchases.getOfferings()
      return (
        offerings.current?.availablePackages.map((pkg: PurchasesPackage) => ({
          id: pkg.identifier,
          name: pkg.packageType,
          description: pkg.product.description,
          price: pkg.product.price,
          currency: pkg.product.currencyCode,
          type: this.getProductType(pkg.product.productType),
          period: pkg.product.subscriptionPeriod ?? undefined,
        })) ?? []
      )
    } catch (error) {
      console.error("Failed to get RevenueCat products:", error)
      return []
    }
  }

  async getEntitlements(): Promise<Record<string, Entitlement>> {
    try {
      const info: CustomerInfo = await Purchases.getCustomerInfo()
      const entitlements: Record<string, Entitlement> = {}

      Object.entries(info.entitlements.active).forEach(([id, ent]) => {
        entitlements[id] = {
          id,
          isActive: true,
          willRenew: ent.willRenew,
          expirationDate: ent.expirationDate ? new Date(ent.expirationDate) : undefined,
          source: "subscription",
        }
      })

      info.nonSubscriptionTransactions.forEach((transaction) => {
        entitlements[`purchase_${transaction.productIdentifier}`] = {
          id: `purchase_${transaction.productIdentifier}`,
          isActive: true,
          source: "purchase",
        }
      })

      return entitlements
    } catch (error) {
      console.error("Failed to get entitlements:", error)
      return {}
    }
  }

  async purchase(productId: string): Promise<boolean> {
    try {
      const offerings = await Purchases.getOfferings()
      const pkg = offerings.current?.availablePackages.find((p) => p.identifier === productId)
      if (pkg) {
        const { customerInfo } = await Purchases.purchasePackage(pkg)
        return Object.keys(customerInfo.entitlements.active).length > 0
      }
      return false
    } catch (error) {
      console.error("Purchase failed:", error)
      return false
    }
  }

  async restore(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases()
      return Object.keys(customerInfo.entitlements.active).length > 0
    } catch {
      return false
    }
  }

  private getProductType(rcType: string): PurchaseProduct["type"] {
    switch (rcType) {
      case "CONSUMABLE":
        return "consumable"
      case "NON_CONSUMABLE":
        return "non_consumable"
      default:
        return "subscription"
    }
  }
}
