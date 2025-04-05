"use client"

import { useWallet } from "@/hooks/use-wallet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Settings, History, Shield, Loader2, Key } from "lucide-react"
import "@/app/globals.css"

export default function AccountPage() {
  const { isConnected, isConnecting, connect, address, error } = useWallet()

  const handleConnect = () => {
    connect()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Account</h1>

      {!isConnected ? (
        <Card className="bg-[#0A1029] border-gray-800">
          <CardContent className="p-8 flex flex-col items-center">
            <Wallet size={48} className="text-pink-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6 text-center max-w-md">
              Connect your wallet to view your account details, transaction history, and manage your settings.
            </p>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <Button onClick={handleConnect} className="bg-pink-600 hover:bg-pink-700" disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="bg-[#0A1029] border-gray-800 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#050A1C]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-[#050A1C]">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#050A1C]">
              Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#050A1C]">
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-[#0A1029] border-gray-800 mb-6">
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address</span>
                    <span className="font-mono">{address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span>Ethereum Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connected</span>
                    <span className="text-green-500">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A1029] border-gray-800">
              <CardHeader>
                <CardTitle>Portfolio Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-gray-400 text-sm">Total Value</p>
                      <p className="text-2xl font-bold">$0.00</p>
                    </div>
                    <Button variant="outline" className="border-gray-700 text-sm">
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="bg-[#050A1C] p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Deposited</p>
                      <p className="text-xl font-bold">$0.00</p>
                    </div>
                    <div className="bg-[#050A1C] p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Earned</p>
                      <p className="text-xl font-bold">$0.00</p>
                    </div>
                    <div className="bg-[#050A1C] p-4 rounded-lg">
                      <p className="text-gray-400 text-sm">Available</p>
                      <p className="text-xl font-bold">$0.00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-[#0A1029] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History size={20} className="mr-2" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">No transactions found</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-[#0A1029] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings size={20} className="mr-2" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Display Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <span className="text-green-500">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Currency</span>
                        <span>USD</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Transaction Updates</span>
                        <span className="text-green-500">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Price Alerts</span>
                        <span className="text-red-500">Disabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-[#0A1029] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield size={20} className="mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Connected Devices</h3>
                    <div className="bg-[#050A1C] p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Current Browser</p>
                          <p className="text-sm text-gray-400">Last active: Just now</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-700">
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Security Features</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Transaction Signing</span>
                        <span className="text-green-500">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Spending Limits</span>
                        <span className="text-red-500">Not Set</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

