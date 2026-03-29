import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts';
import { themeColors } from '../theme/colors';
import type { Transaction } from '../types';

const categories = {
  expense: ['Food', 'Transport', 'Accommodation', 'Study Materials', 'Healthcare', 'Entertainment', 'Other'],
  income: ['Allowance', 'Scholarship', 'Part-time Work', 'Other'],
};

const initialTransactions: Transaction[] = [
  { id: '1', type: 'expense', category: 'Food', amount: 500, description: 'Groceries', date: '2026-02-18' },
  { id: '2', type: 'expense', category: 'Transport', amount: 200, description: 'Matatu to campus', date: '2026-02-18' },
  { id: '3', type: 'income', category: 'Allowance', amount: 5000, description: 'Monthly allowance', date: '2026-02-15' },
  { id: '4', type: 'expense', category: 'Accommodation', amount: 12000, description: 'Rent', date: '2026-02-01' },
  { id: '5', type: 'expense', category: 'Food', amount: 300, description: 'Restaurant', date: '2026-02-17' },
];

export function BudgetScreen() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showAdd, setShowAdd] = useState(false);
  const [newTx, setNewTx] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
  });

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  const byCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const addTransaction = () => {
    const amount = parseFloat(newTx.amount);
    if (!newTx.category || !amount || !newTx.description) return;
    setTransactions([
      { id: Date.now().toString(), type: newTx.type, category: newTx.category, amount, description: newTx.description, date: new Date().toISOString().split('T')[0] },
      ...transactions,
    ]);
    setNewTx({ type: 'expense', category: '', amount: '', description: '' });
    setShowAdd(false);
  };

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.bgSecondary }]} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Budget Tracker</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your finances in KES</Text>
          </View>
          <Pressable onPress={() => setShowAdd(true)} style={[styles.addBtn, { backgroundColor: colors.accent }]}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>KES {balance.toLocaleString()}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Ionicons name="trending-up" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.balanceItemLabel}>Income</Text>
              <Text style={styles.balanceItemVal}>KES {totalIncome.toLocaleString()}</Text>
            </View>
            <View style={styles.balanceItem}>
              <Ionicons name="trending-down" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.balanceItemLabel}>Expenses</Text>
              <Text style={styles.balanceItemVal}>KES {totalExpenses.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Expenses by Category</Text>
          {Object.entries(byCategory).map(([cat, amount]) => {
            const pct = totalExpenses ? (amount / totalExpenses) * 100 : 0;
            return (
              <View key={cat} style={styles.categoryRow}>
                <View style={styles.categoryHeader}>
                  <Text style={[styles.categoryName, { color: colors.textSecondary }]}>{cat}</Text>
                  <Text style={[styles.categoryAmount, { color: colors.textPrimary }]}>KES {amount.toLocaleString()}</Text>
                </View>
                <View style={[styles.barBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: colors.accent }]} />
                </View>
              </View>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
        {transactions.slice(0, 10).map((tx) => (
          <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card }]}>
            <View style={styles.txLeft}>
              <View style={[styles.txIcon, { backgroundColor: tx.type === 'income' ? '#dcfce7' : '#fee2e2' }]}>
                <Ionicons name={tx.type === 'income' ? 'trending-up' : 'trending-down'} size={20} color={tx.type === 'income' ? '#16a34a' : '#dc2626'} />
              </View>
              <View>
                <Text style={[styles.txDesc, { color: colors.textPrimary }]}>{tx.description}</Text>
                <Text style={[styles.txMeta, { color: colors.textTertiary }]}>{tx.category} • {tx.date}</Text>
              </View>
            </View>
            <Text style={[styles.txAmount, { color: tx.type === 'income' ? '#16a34a' : '#dc2626' }]}>
              {tx.type === 'income' ? '+' : '-'}KES {tx.amount.toLocaleString()}
            </Text>
          </View>
        ))}

        <View style={[styles.tipsCard, { backgroundColor: '#dcfce7' }]}>
          <Text style={[styles.tipsTitle, { color: '#166534' }]}>💰 Budget Tips for Kenya</Text>
          <Text style={[styles.tip, { color: '#15803d' }]}>• Use M-Pesa for safe digital payments</Text>
          <Text style={[styles.tip, { color: '#15803d' }]}>• Matatus are cheaper than taxis</Text>
          <Text style={[styles.tip, { color: '#15803d' }]}>• Buy from local markets to save on groceries</Text>
          <Text style={[styles.tip, { color: '#15803d' }]}>• Student discounts available at many places</Text>
        </View>
      </ScrollView>

      <Modal visible={showAdd} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setShowAdd(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Add Transaction</Text>
            <View style={styles.modalRow}>
              <Pressable
                onPress={() => setNewTx((p) => ({ ...p, type: 'expense' }))}
                style={[styles.typeBtn, newTx.type === 'expense' && styles.typeBtnActive]}
              >
                <Text style={newTx.type === 'expense' ? styles.typeBtnTextActive : styles.typeBtnText}>Expense</Text>
              </Pressable>
              <Pressable
                onPress={() => setNewTx((p) => ({ ...p, type: 'income' }))}
                style={[styles.typeBtn, newTx.type === 'income' && styles.typeBtnActive]}
              >
                <Text style={newTx.type === 'income' ? styles.typeBtnTextActive : styles.typeBtnText}>Income</Text>
              </Pressable>
            </View>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={newTx.category}
              onChangeText={(v) => setNewTx((p) => ({ ...p, category: v }))}
              placeholder="Select category"
            />
            <Text style={styles.label}>Amount (KES)</Text>
            <TextInput
              style={styles.input}
              value={newTx.amount}
              onChangeText={(v) => setNewTx((p) => ({ ...p, amount: v }))}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={newTx.description}
              onChangeText={(v) => setNewTx((p) => ({ ...p, description: v }))}
              placeholder="What was this for?"
            />
            <Pressable onPress={addTransaction} style={[styles.primaryBtn, { backgroundColor: colors.accent }]}>
              <Text style={styles.primaryBtnText}>Add Transaction</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  balanceCard: { backgroundColor: '#2563eb', borderRadius: 16, padding: 24, marginBottom: 20 },
  balanceLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  balanceValue: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 16 },
  balanceRow: { flexDirection: 'row', gap: 16 },
  balanceItem: { flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 12 },
  balanceItemLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  balanceItemVal: { fontSize: 16, fontWeight: '600', color: '#fff' },
  card: { borderRadius: 16, padding: 16, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  categoryRow: { marginBottom: 12 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  categoryName: { fontSize: 14 },
  categoryAmount: { fontSize: 14, fontWeight: '600' },
  barBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  txRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 8 },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  txDesc: { fontWeight: '500' },
  txMeta: { fontSize: 12 },
  txAmount: { fontWeight: '600' },
  tipsCard: { borderRadius: 16, padding: 16, marginTop: 20 },
  tipsTitle: { fontWeight: '600', marginBottom: 8 },
  tip: { fontSize: 14, marginBottom: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  modalRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', backgroundColor: '#f3f4f6' },
  typeBtnActive: { backgroundColor: '#2563eb' },
  typeBtnText: { color: '#6b7280', fontWeight: '500' },
  typeBtnTextActive: { color: '#fff', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { height: 44, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12 },
  primaryBtn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '600' },
});
