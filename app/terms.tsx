import React from 'react';
import { View, Text, ScrollView, Platform, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function TermsAndConditions() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="white" />
      
      {/* Header */}
      <View 
        className="bg-white border-b border-gray-200 px-4 flex-row items-center"
        style={{ 
          paddingTop: Platform.OS === 'ios' ? insets.top + 10 : 10,
          paddingBottom: 15 
        }}
      >
        <Pressable 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <Text className="text-lg font-bold">←</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 ml-3">
          Terms and Conditions
        </Text>
      </View>

      {/* Content */}
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      >
        <View className="space-y-6">
          {/* Introduction */}
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </Text>
            <Text className="text-gray-600 text-base leading-6">
              Last updated: {new Date().toLocaleDateString()}
            </Text>
            <Text className="text-gray-700 text-base leading-6 mt-4">
              Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Habitta mobile application (the "Service") operated by Habitta ("us", "we", or "our").
            </Text>
          </View>

          {/* Section 1 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </Text>
          </View>

          {/* Section 2 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              2. Use License
            </Text>
            <Text className="text-gray-700 text-base leading-6 mb-3">
              Permission is granted to temporarily download one copy of Habitta per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </Text>
            <View className="ml-4">
              <Text className="text-gray-700 text-base leading-6 mb-1">• Modify or copy the materials</Text>
              <Text className="text-gray-700 text-base leading-6 mb-1">• Use the materials for any commercial purpose</Text>
              <Text className="text-gray-700 text-base leading-6 mb-1">• Attempt to reverse engineer any software</Text>
              <Text className="text-gray-700 text-base leading-6">• Remove any copyright or other proprietary notations</Text>
            </View>
          </View>

          {/* Section 3 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              3. Privacy Policy
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              Your privacy is important to us. We collect and use your personal information only as described in our Privacy Policy. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </Text>
          </View>

          {/* Section 4 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              4. User Accounts
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
            </Text>
          </View>

          {/* Section 5 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              5. Property Listings
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              Users who list properties on our platform are responsible for the accuracy of all information provided. We reserve the right to remove any listing that violates our community guidelines or contains false information.
            </Text>
          </View>

          {/* Section 6 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              6. Limitation of Liability
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              In no event shall Habitta or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Habitta's application.
            </Text>
          </View>

          {/* Section 7 */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              7. Changes to Terms
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </Text>
          </View>

          {/* Contact */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-3">
              Contact Us
            </Text>
            <Text className="text-gray-700 text-base leading-6">
              If you have any questions about these Terms and Conditions, please contact us at support@habitta.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}