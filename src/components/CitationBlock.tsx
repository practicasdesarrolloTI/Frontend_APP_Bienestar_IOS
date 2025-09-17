import React from 'react';
import { View, Text, Linking, Pressable } from 'react-native';
import { CITATIONS, SurveyKey } from '../data/citations';
 
type Props = { surveyKey: SurveyKey };
 
export default function CitationBlock({ surveyKey }: Props) {
  const items = CITATIONS[surveyKey] ?? [];
 
  if (!items.length) return null;
 
  return (
<View style={{ marginTop: 24, padding: 12, borderRadius: 12, backgroundColor: '#f6f7f9' }}>
<Text
        accessibilityRole="header"
        style={{ fontWeight: '700', fontSize: 16, marginBottom: 8, color: '#1b3358' }}
>
        Fuentes (bibliografía)
</Text>
 
      {items.map((c, i) => (
<View key={i} style={{ marginBottom: 8 }}>
<Text style={{ fontSize: 13, lineHeight: 18, color: '#0c1b2a' }}>{`• ${c.text}`}</Text>
 
          {!!c.url && (
<Pressable
              onPress={() => Linking.openURL(c.url!)}
              accessibilityRole="link"
              style={{ marginTop: 4 }}
>
<Text style={{ fontSize: 13, textDecorationLine: 'underline' }}>
                Ver documento
</Text>
</Pressable>
          )}
</View>
      ))}
</View>
  );
}