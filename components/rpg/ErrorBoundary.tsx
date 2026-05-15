import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RPG } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado nesta tela.</Text>
          <Text style={styles.body}>Reinicie o app ou navegue para outra aba.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RPG.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: RPG.gold,
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    color: RPG.textMuted,
    fontSize: 13,
    fontFamily: 'serif',
    textAlign: 'center',
    lineHeight: 20,
  },
});
