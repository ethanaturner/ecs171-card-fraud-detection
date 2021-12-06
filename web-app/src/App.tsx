import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Stack,
} from '@mui/material';
import { CreditCard } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import styles from './App.module.css';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from 'axios';

const categories = [
  'gas_transport',
  'grocery_pos',
  'home',
  'shopping_pos',
  'kids_pets',
  'shopping_net',
  'entertainment',
  'food_dining',
  'personal_care',
  'health_fitness',
  'misc_pos',
  'misc_net',
  'grocery_net',
  'travel',
];

let timestamp = Date.now();

export default function App() {
  const [category, setCategory] = useState<string>(categories[0]);
  const [transCount7Days, setTransCount7Days] = useState<number>(10);
  const [transCount30Days, setTransCount30Days] = useState<number>(20);
  const [amount, setAmount] = useState<number>(100);
  const [time, setTime] = useState<string>('12:00');
  const [timeDiff, setTimeDiff] = useState<number>(12); // in hours
  const [isFraud, setFraud] = useState<boolean>(false);
  // const [timestamp, setTimestamp] = useState<number>(0);

  // Call API when any field in the form changes
  useEffect(() => {
    const capturedTimestamp = Date.now();
    timestamp = capturedTimestamp;

    setTimeout(() => {
      if (capturedTimestamp === timestamp) {
        const params = {
          category,
          amount,
          time,
          timeDiff,
          transCount7Days,
          transCount30Days,
        };

        console.log(params);

        axios.get('http://localhost:5000/predict', { params }).then(res => {
          if (res.data === 'fraud') {
            setFraud(true);
          } else if (res.data === 'notFraud') {
            setFraud(false);
          } else {
            console.error('Unrecognized response');
          }
        });
      }
    }, 800);
  }, [category, amount, time, timeDiff, transCount7Days, transCount30Days]);

  return (
    <>
      <header className={styles.header}>
        <h1>Card Fraud Detection</h1>
      </header>

      <main className={styles.main}>
        <Card className={styles.card}>
          <h2>Inputs</h2>

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <MenuItem value={cat}>{convertToTitleCase(cat)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value))}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Amount"
              />
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2} mt={2}>
            <TextField
              fullWidth
              id="time"
              label="Time"
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="time-diff-label">
                Hours since Last Transaction
              </InputLabel>
              <OutlinedInput
                value={timeDiff}
                type="number"
                onChange={e => setTimeDiff(parseFloat(e.target.value))}
                id="time-diff-label"
                label="Hours since Last Transaction"
              />
            </FormControl>
          </Stack>

          <p style={{ margin: '16px 0 0' }}>
            # of transactions in 7 days: {transCount7Days}
          </p>
          <Slider
            min={0}
            max={300}
            step={5}
            value={transCount7Days}
            valueLabelDisplay="auto"
            onChange={(_e, value) => {
              const n = value as number;
              if (n > transCount30Days) {
                setTransCount30Days(n);
              }
              setTransCount7Days(n);
            }}
          />

          <p style={{ margin: '8px 0 0' }}>
            # of transactions in 30 days: {transCount30Days}
          </p>
          <Slider
            min={0}
            max={600}
            step={10}
            value={transCount30Days}
            valueLabelDisplay="auto"
            onChange={(_e, value) => {
              const n = value as number;
              if (n < transCount7Days) {
                setTransCount7Days(n);
              }
              setTransCount30Days(n);
            }}
          />
        </Card>

        <Card className={styles.card}>
          <h2>Prediction</h2>
          <CreditCard
            color={isFraud ? 'error' : 'success'}
            style={{ fontSize: '128px', alignSelf: 'center' }}
          />
          <p style={{ fontSize: '32px', alignSelf: 'center' }}>
            {isFraud ? 'FRAUD' : 'Not Fraud'}
          </p>
        </Card>
      </main>
    </>
  );
}

function convertToTitleCase(s: string): string {
  return s
    .split('_')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(' ');
}
