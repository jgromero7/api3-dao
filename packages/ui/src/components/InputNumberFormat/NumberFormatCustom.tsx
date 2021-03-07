import NumberFormat from 'react-number-format';

const styles = {
  font16: {
    fontSize: 16 
  }
}

const NumberFormatCustom = (props: any) => {
    const { inputRef, onChange, ...other } = props;
    return (
      <NumberFormat
        {...other}
        style={styles.font16}
        getInputRef={inputRef}
        allowNegative={false}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          });
        }}
        thousandSeparator
        suffix={" API3"}
        // isNumericString
      />
    );
}

export default NumberFormatCustom;