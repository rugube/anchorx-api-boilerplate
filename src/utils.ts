import { Prisma } from './generated/prisma'
import {
  Keypair, // Keypair represents public and secret keys.
  Networks, // Network provides helper methods to get the passphrase or id for different stellar networks.
  Operation, // Operation helps you represent/build operations in Stellar network.
  Server, // Server handles the network connections.
  TransactionBuilder // Helps you construct transactions.
} from 'stellar-sdk'

export interface Context {
  db: Prisma
  request: any
}

try {
  // Tell the Stellar SDK you are using the testnet
  // point to testnet host
  const stellarServer = new Server('https://horizon-testnet.stellar.org');

  // Never put values like the an account seed in code.
const provisionerKeyPair = Keypair.fromSecret('SAZZGPURDGJO7D2G66CGJB6BDAYUDUIZAWKHU75NWGHH6BX25UEIESC2')

  // Load account from Stellar
  const provisioner = await stellarServer.loadAccount(provisionerKeyPair.publicKey())

  console.log('creating account in ledger', Keypair.publicKey())
  const transaction = new TransactionBuilder(provisioner)
        .addOperation(
          // Operation to create new accounts
          Operation.createAccount({
            destination: Keypair.publicKey(),
            startingBalance: '2'
          })
        ).build()

  // Sign the transaction above
  transaction.sign(provisionerKeyPair)

  // Submit transaction to the server
  const result = await stellarServer.submitTransaction(transaction);
  console.log('Account created: ', result)
} catch (e) {
  console.log('Stellar account not created.', e)
}