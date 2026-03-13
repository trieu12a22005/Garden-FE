// src/components/pdf/prescriptionPdfStyles.ts
import { StyleSheet } from '@react-pdf/renderer';

export const stylesPDF = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 32,
    fontSize: 11,
    lineHeight: 1.5,
    color: '#000',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textTransform: 'uppercase',
  },

  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  col: {
    flex: 1,
  },
  col2: {
    flex: 2,
  },

  fieldWrap: {
    marginBottom: 2,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  valueLine: {
    minHeight: 18,
    paddingBottom: 2,
    justifyContent: 'flex-end',
  },
  valueBlock: {
    minHeight: 42,
    paddingBottom: 2,
    justifyContent: 'flex-end',
  },
  valueBlockLarge: {
    minHeight: 54,
    paddingBottom: 2,
    justifyContent: 'flex-end',
  },

  medicineTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },

  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeaderCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 6,
    fontWeight: 'bold',
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 6,
  },
  lastCell: {
    borderRightWidth: 0,
  },

  footer: {
    marginTop: 28,
    alignItems: 'flex-end',
  },
  dateLine: {
    marginBottom: 10,
    textAlign: 'center',
    width: 220,
  },
  signatureBox: {
    marginTop: 8,
    width: 220,
    textAlign: 'center',
  },
  signatureNote: {
    fontSize: 10,
  },
});