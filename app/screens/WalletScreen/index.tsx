import React, { useState, useEffect } from "react"
import { View, Pressable } from "react-native"
import { AppStackScreenProps } from "@/app/navigators"
import {
  Text,
  Screen,
  AdaptiveHeader,
  Card,
  Button,
  Modal,
  Input,
  ProgressIndicator,
  Separator,
} from "@/app/ui/components"
import { useTheme } from "@/app/ui/theme/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { cn } from "@/app/ui/lib/cn"
import { useWalletStore } from "@/lib/WalletStore"
import { useUserStore } from "@/lib/UserStore"
import { formatDistanceToNow } from "date-fns"
import { Wallet } from "@/app/types/global"

interface WalletScreenProps extends AppStackScreenProps<"Wallet"> {}

export const WalletScreen = function WalletScreen({
  navigation,
}: WalletScreenProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  // Store integration
  const { wallets, pendingTransactions, deposit, withdraw, isLoading, error } = useWalletStore()
  const { currentUser, userStats } = useUserStore()

  // Local state
  const [activeModal, setActiveModal] = useState<"deposit" | "withdraw" | null>(null)
  const [amount, setAmount] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  // Get current wallet
  const currentWallet = currentUser ? wallets[currentUser.id] : null
  const pendingAmount = Object.values(pendingTransactions)
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0)

  // Handle transaction
  const handleTransaction = async () => {
    if (!currentUser || !amount || isNaN(Number(amount))) {
      setLocalError("Please enter a valid amount")
      return
    }

    try {
      if (activeModal === "deposit") {
        await deposit(currentUser.id, Number(amount))
      } else if (activeModal === "withdraw") {
        await withdraw(currentUser.id, Number(amount))
      }
      setActiveModal(null)
      setAmount("")
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Transaction failed")
    }
  }

  // Recent transactions filter
  const recentTransactions = Object.entries(pendingTransactions)
    .map(([id, transaction]) => ({
      id,
      ...transaction,
    }))
    .sort((a, b) => (b.status === "pending" ? 1 : -1))
    .slice(0, 5)

  return (
    <Screen
      safeAreaEdges={["top"]}
      className="bg-background"
      contentContainerClassName="flex-1 px-4"
      contentContainerStyle={{
        paddingBottom: insets.bottom,
      }}
    >
      <AdaptiveHeader iosTitle="Wallet" />

      {/* Balance Card */}
      <Card className="mt-4 bg-card p-4 rounded-lg">
        <Text variant="title2" className="text-center text-primary">
          Total Balance
        </Text>
        <Text variant="largeTitle" className="text-center mt-2">
          ${currentWallet?.balance.toFixed(2) || "0.00"}
        </Text>
        <View className="flex-row justify-between mt-4">
          <View>
            <Text variant="caption1" className="text-dim">
              Available
            </Text>
            <Text variant="body">
              ${((currentWallet?.balance || 0) - (currentWallet?.lockedBalance || 0)).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text variant="caption1" className="text-dim">
              Locked in Bets
            </Text>
            <Text variant="body">${currentWallet?.lockedBalance.toFixed(2) || "0.00"}</Text>
          </View>
        </View>
      </Card>

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-4 gap-4">
        <Button
          variant="default"
          className="flex-1"
          onPress={() => setActiveModal("deposit")}
        >
          Deposit
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onPress={() => setActiveModal("withdraw")}
        >
          Withdraw
        </Button>
      </View>

      {/* Stats Card */}
      <Card className="mt-4 bg-card p-4 rounded-lg">
        <Text variant="heading" className="mb-2">
          Betting Statistics
        </Text>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text variant="caption1" className="text-dim">
              Win Rate
            </Text>
            <ProgressIndicator
              value={
                currentUser && userStats[currentUser.id]
                  ? userStats[currentUser.id].winRate * 100
                  : 0
              }
              max={100}
              className="mt-1"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text variant="caption1" className="text-dim">
              Avg. Stake
            </Text>
            <Text variant="body">
              ${currentUser && userStats[currentUser.id]
                ? userStats[currentUser.id].avgStake.toFixed(2)
                : "0.00"}
            </Text>
          </View>
        </View>
      </Card>

      {/* Recent Transactions */}
      <View className="mt-4 flex-1">
        <Text variant="heading" className="mb-2">
          Recent Transactions
        </Text>
        <View className="flex-1">
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} className="py-2">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text variant="body" className="capitalize">
                    {transaction.type}
                  </Text>
                  <Text variant="caption2" className="text-dim">
                    {transaction.status}
                  </Text>
                </View>
                <Text
                  variant="body"
                  className={cn(
                    transaction.type === "withdrawal" ? "text-error" : "text-success"
                  )}
                >
                  {transaction.type === "withdrawal" ? "-" : "+"}$
                  {transaction.amount.toFixed(2)}
                </Text>
              </View>
              <Separator className="mt-2" />
            </View>
          ))}
        </View>
      </View>

      {/* Transaction Modal */}
      <Modal
        visible={activeModal !== null}
        onClose={() => {
          setActiveModal(null)
          setAmount("")
          setLocalError(null)
        }}
        className="p-4 bg-card rounded-lg w-[90%]"
      >
        <Text variant="heading" className="text-center mb-4">
          {activeModal === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
        </Text>
        <Input
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          className="mb-4"
        />
        {(localError || error) && (
          <Text className="text-error mb-4">{localError || error}</Text>
        )}
        <Button
          variant="default"
          onPress={handleTransaction}
          disabled={isLoading || !amount}
        >
          {isLoading ? "Processing..." : "Confirm"}
        </Button>
      </Modal>
    </Screen>
  )
}