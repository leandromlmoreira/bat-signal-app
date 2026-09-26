import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E17',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  title: {
    color: '#F5C242',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
  },
  subtitle: {
    color: '#9AA0B4',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  signalArea: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 16,
  },
  buttonInactive: {
    backgroundColor: '#1A1D2B',
    borderColor: '#F5C242',
  },
  buttonActive: {
    backgroundColor: '#F5C242',
    borderColor: '#F5C242',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#F5C242',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonTextActive: {
    color: '#1A1D2B',
  },
  counter: {
    marginTop: 24,
    color: '#5A5F73',
    fontSize: 12,
  },
});
